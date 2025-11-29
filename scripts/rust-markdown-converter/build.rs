extern crate napi_build;

use std::env;
use std::fs;
use std::path::Path;

fn main() {
    napi_build::setup();

    // Generate product mappings from products.yml
    generate_product_mappings();
}

fn generate_product_mappings() {
    // Tell Cargo to rerun this build script if products.yml changes
    println!("cargo:rerun-if-changed=../../data/products.yml");

    let out_dir = env::var("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("product_mappings.rs");

    // Read products.yml
    let products_path = "../../data/products.yml";
    let yaml_content = fs::read_to_string(products_path)
        .expect("Failed to read products.yml");

    // Parse YAML using serde_yaml
    let products: serde_yaml::Value = serde_yaml::from_str(&yaml_content)
        .expect("Failed to parse products.yml");

    // Generate Rust code for the URL pattern map
    let mut mappings = Vec::new();

    if let serde_yaml::Value::Mapping(products_map) = products {
        for (key, value) in products_map.iter() {
            if let (serde_yaml::Value::String(_product_key), serde_yaml::Value::Mapping(product_data)) = (key, value) {
                // Extract name
                let name = product_data.get(&serde_yaml::Value::String("name".to_string()))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");

                // Extract namespace
                let namespace = product_data.get(&serde_yaml::Value::String("namespace".to_string()))
                    .and_then(|v| v.as_str())
                    .unwrap_or("");

                // Extract versions array (if exists)
                let versions = product_data.get(&serde_yaml::Value::String("versions".to_string()))
                    .and_then(|v| v.as_sequence())
                    .map(|seq| {
                        seq.iter()
                            .filter_map(|v| v.as_str())
                            .collect::<Vec<_>>()
                    })
                    .unwrap_or_default();

                // Build URL patterns from namespace and versions data
                // Convert namespace like "influxdb3_explorer" to URL path "/influxdb3/explorer/"
                let url_base = if namespace.contains('_') {
                    let parts: Vec<&str> = namespace.split('_').collect();
                    format!("/{}/", parts.join("/"))
                } else {
                    format!("/{}/", namespace)
                };

                if !versions.is_empty() {
                    // For products with versions, create a mapping for each version
                    for version in &versions {
                        // Build URL: base + version (without trailing slash for now, added later if needed)
                        let url_pattern = url_base.trim_end_matches('/').to_string() + "/" + version;

                        // Try to get version-specific name (e.g., name__v2, name__cloud)
                        let version_key = format!("name__{}", version.replace("-", ""));
                        let version_name = product_data.get(&serde_yaml::Value::String(version_key))
                            .and_then(|v| v.as_str())
                            .unwrap_or(name);

                        mappings.push(format!(
                            "        m.insert(\"{}\", (\"{}\", \"{}\"));",
                            url_pattern, version_name, version
                        ));
                    }
                } else if !namespace.is_empty() {
                    // For products without versions, use namespace directly
                    // Extract the version identifier from the latest field
                    let latest = product_data.get(&serde_yaml::Value::String("latest".to_string()))
                        .and_then(|v| v.as_str())
                        .unwrap_or("");

                    // Use the base path without trailing slash for pattern matching
                    let url_pattern = url_base.trim_end_matches('/').to_string();

                    mappings.push(format!(
                        "        m.insert(\"{}/\", (\"{}\", \"{}\"));",
                        url_pattern, name, latest
                    ));
                }
            }
        }
    }

    // Generate the Rust code
    let generated_code = format!(
        r#"// Auto-generated from data/products.yml - DO NOT EDIT MANUALLY
// Note: HashMap and lazy_static are already imported in lib.rs

lazy_static! {{
    pub static ref URL_PATTERN_MAP: HashMap<&'static str, (&'static str, &'static str)> = {{
        let mut m = HashMap::new();
{}
        m
    }};
}}
"#,
        mappings.join("\n")
    );

    fs::write(&dest_path, generated_code)
        .expect("Failed to write product_mappings.rs");
}

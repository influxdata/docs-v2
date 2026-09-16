<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Stock Portfolio Tracker plugin periodically fetches current stock, ETF, and mutual fund prices from Yahoo Finance and writes per-holding rows plus per-portfolio and per-category roll-up totals to {{% product-name %}}. Configure your holdings inline as trigger arguments or in a TOML file, group them into named portfolios (e.g. `401k`, `brokerage`) and user-defined categories (e.g. `Retirement`, `Investment`), and the plugin will track the value of each holding and each grouping over time. Built-in gating skips fetches during market closures (with a clear log line so dashboard gaps have a known cause), polls mutual funds only once per day after NAV close, and carries forward the last known price for skipped symbols so portfolio totals stay accurate.

### Scope

Yahoo Finance supports tickers from many global exchanges (e.g. `.L` for London, `.T` for Tokyo, `.PA` for Paris), so the price-fetch path works for international holdings out of the box. The **market-hours gating** is also internationalizable: `market_calendar` and `market_timezone` configure which exchange's calendar to use. Defaults are US-centric (`NYSE` / `America/New_York`) because that's the most common case, but any exchange name accepted by [pandas_market_calendars](https://pandas-market-calendars.readthedocs.io/) works (LSE, TSX, JPX, XETR, ASX, HKEX, etc.). Currency conversion is **not** performed — all values are stored in whatever currency yfinance returns per symbol; this is recorded on the `currency` field of `stock_holdings` rows. If your portfolio mixes currencies, do conversion at query time.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. The plugin also supports a TOML configuration file for the full portfolio shape; the trigger-argument form is best for one-off testing.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines the supported trigger type and configuration parameters. This metadata enables the InfluxDB 3 Explorer UI to display and configure the plugin.

### Optional parameters

| Parameter                   | Type    | Default                  | Description                                                                                                                                                                                                                                 |
|-----------------------------|---------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `database`                  | string  | `stocks`                 | Target database for writes.                                                                                                                                                                                                                 |
| `portfolio`                 | string  | `AAPL:1\|MSFT:1\|GOOG:1` | Inline holdings: pipe-separated `SYMBOL:QUANTITY[:PORTFOLIO_NAME]` entries (e.g. `AAPL:10:401k\|MSFT:5:401k\|GOOG:2.5:brokerage`). Portfolio defaults to `main`. When omitted and no TOML config is found, falls back to the default shown. |
| `categories`                | string  | none                     | Inline category map: pipe-separated `PORTFOLIO:CATEGORY` entries (e.g. `401k:Retirement\|brokerage:Investment`).                                                                                                                            |
| `config_path`               | string  | `stock_plugin.toml`      | Path to the TOML config file, relative to the InfluxDB plugin directory (or absolute). The default file is loaded when it exists; an explicit `config_path` that does not exist is an error.                                                |
| `write_during_closed_hours` | boolean | `true`                   | See the TOML table below. Also settable as a trigger argument.                                                                                                                                                                              |
| `mutual_fund_check_time`    | string  | `18:00`                  | See the TOML table below. Also settable as a trigger argument.                                                                                                                                                                              |
| `market_calendar`           | string  | `NYSE`                   | See the TOML table below. Also settable as a trigger argument.                                                                                                                                                                              |
| `market_timezone`           | string  | `America/New_York`       | See the TOML table below. Also settable as a trigger argument.                                                                                                                                                                              |

*If neither `portfolio` nor a TOML file with `[holdings.<name>]` is provided, the plugin runs with the default holdings `AAPL:1|MSFT:1|GOOG:1` in the `main` portfolio.*

### TOML configuration

The TOML file is the recommended way to configure anything more than a handful of holdings. The plugin reads it from `config_path` (default: `<plugin-dir>/stock_plugin.toml`).

Trigger arguments take precedence over TOML keys of the same name, so a TOML file can hold the full portfolio shape while a trigger argument overrides a single setting.

Holdings and categories are the exception, because each is spelled differently per source:

| Setting    | Trigger argument                      | TOML                           |
|------------|---------------------------------------|--------------------------------|
| Holdings   | `portfolio=AAPL:10:401k\|MSFT:5:401k` | `[holdings.401k]` tables       |
| Categories | `categories=401k:Retirement`          | `[portfolio_categories]` table |

Each spelling is read only from its own source: a top-level `portfolio` or `categories` key in the TOML file is ignored, as is a trigger argument named `holdings` or `portfolio_categories`. When both sources are present, the trigger argument replaces the TOML tables entirely rather than merging with them.

| Key                         | Type    | Default              | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-----------------------------|---------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `database`                  | string  | `stocks`             | Target database for writes.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `write_during_closed_hours` | boolean | `true`               | When `false`, stocks/ETFs are skipped outside the configured exchange's regular session (the calendar handles holidays and early closes). Mutual funds always follow their own daily check schedule.                                                                                                                                                                                                                                   |
| `mutual_fund_check_time`    | string  | `"18:00"`            | Time of day in `market_timezone` after which the plugin fetches mutual fund NAV. Mutual funds are fetched at most once per local calendar day, at the first tick at or after this time. Bootstrap exception: a mutual fund with no cached asset type is fetched on its first tick regardless of time.                                                                                                                                  |
| `market_calendar`           | string  | `"NYSE"`             | Exchange calendar used for the market-hours check. Any name accepted by [pandas_market_calendars](https://pandas-market-calendars.readthedocs.io/) (e.g. `NYSE`, `LSE`, `TSX`, `JPX`, `XETR`, `ASX`, `HKEX`).                                                                                                                                                                                                                          |
| `market_timezone`           | string  | `"America/New_York"` | IANA timezone for the exchange's local time. Used for `mutual_fund_check_time` comparisons and for resolving the "today" date the calendar consults.                                                                                                                                                                                                                                                                                   |
| `[portfolio_categories]`    | table   | empty                | Maps portfolio name to category name. Portfolios not listed are uncategorized (omitted from `category_totals`).                                                                                                                                                                                                                                                                                                                        |
| `[holdings.<portfolio>]`    | table   | default holdings     | Holdings for each portfolio. Each entry is `SYMBOL = quantity`. Fractional quantities supported; the quantity must be a finite number (`inf` and `nan` are rejected). Quote symbols containing dots, for example `"VOD.L" = 10`. Duplicate same-symbol entries in one portfolio are aggregated. The portfolio name `_total` is reserved. When no `[holdings.*]` section is present, the plugin falls back to `AAPL:1\|MSFT:1\|GOOG:1`. |

The trigger spec is the source of truth for cadence. For example, `--trigger-spec "every:15m"` runs the plugin every 15 minutes.

#### Example TOML configuration

[stock_plugin.toml.example](stock_plugin.toml.example)

## Software requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python 3.11 or higher**
- **Python packages** (installed into the plugin venv):
  - `yfinance` — Yahoo Finance scraper for price data
  - `pandas_market_calendars` — exchange calendars for accurate market-hours and holiday gating
  - `influxdata-plugin-utils>=0.3.0` — shared configuration, parsing, and write helpers

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package yfinance pandas_market_calendars influxdata-plugin-utils
   ```
3. Copy `stock_plugin.toml.example` to `<plugin-dir>/stock_plugin.toml` and edit it with your holdings and categories.

## Trigger setup

### Basic scheduled trigger (TOML config)

```bash
influxdb3 create trigger \
  --database stocks \
  --path "stock_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments config_path=stock_plugin.toml \
  --error-behavior log \
  stock_portfolio_tracker
```
### Inline holdings without TOML

```bash
influxdb3 create trigger \
  --database stocks \
  --path "stock_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments 'portfolio=AAPL:10:401k|MSFT:5:401k|GOOG:2:brokerage,categories=401k:Retirement|brokerage:Investment' \
  --error-behavior log \
  stock_portfolio_tracker
```
### Skip writes when the configured market is closed

Set `write_during_closed_hours = false` in your TOML config and create the trigger as normal. With the default NYSE calendar, stocks and ETFs will skip outside 9:30–16:00 ET on weekdays and on NYSE holidays. Their portfolio total values are still maintained via carry-forward.

On a cold cache, such as after an InfluxDB restart, a symbol that would otherwise be skipped can be fetched once so the plugin has a last-known price to carry forward on later skipped ticks. The summary log calls these out as cold-cache bootstrap fetches.

## Example usage

### Latest portfolio value by category

```bash
influxdb3 query \
  --database stocks \
  "SELECT category, value, portfolio_count, symbol_count
   FROM category_totals
   WHERE time = (SELECT MAX(time) FROM category_totals)"
```
**Expected output**

```
+------------+-----------+-----------------+--------------+
| category   | value     | portfolio_count | symbol_count |
+------------+-----------+-----------------+--------------+
| Investment | 257908.71 | 2               | 17           |
| Retirement | 1990604.5 | 3               | 5            |
+------------+-----------+-----------------+--------------+
```
### Total portfolio value over time

```bash
influxdb3 query \
  --database stocks \
  "SELECT time, value FROM portfolio_totals
   WHERE portfolio = '_total' ORDER BY time DESC LIMIT 10"
```
### Daily P&L per holding (using previous_close)

```bash
influxdb3 query \
  --database stocks \
  "SELECT symbol, portfolio,
          (price - previous_close) * quantity AS daily_change
   FROM stock_holdings
   WHERE time = (SELECT MAX(time) FROM stock_holdings)
     AND previous_close IS NOT NULL
   ORDER BY daily_change DESC"
```
### Filter for fully fresh rows

Rows in `portfolio_totals` and `category_totals` carry `missing_symbols`, `skipped_symbols`, and `carried_symbols` counts so dashboards can distinguish fully fresh data from carry-forward or partial fetches:

```sql
-- "All symbols fetched fresh this tick"
SELECT * FROM portfolio_totals
WHERE missing_symbols = 0 AND skipped_symbols = 0;

-- "All values present (fresh + carry-forward), no failures"
SELECT * FROM portfolio_totals
WHERE missing_symbols = 0;
```
## Code overview

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Entry point for the scheduled trigger. Stamps one UTC timestamp for the whole run and delegates to `_main` with the runtime-injected `LineBuilder` and the live `influxdb3_local`. All side-effecting work lives in `_main` so its logic can be reasoned about with injected dependencies.

#### `_main(local, args, fetcher, line_builder_cls, now_ns, task_id)`

Drives the full plugin flow:

1. Resolve config from trigger args + TOML.
2. Determine configured market state via `pandas_market_calendars` and parse the mutual-fund check time.
3. For each configured holding, decide whether to fetch (gated by asset type, cached state, and config), fetch via `yfinance.fast_info`, and build a `HoldingRow`.
4. Build carry-forward `HoldingRow`s for intentionally-skipped symbols whose last known price is cached.
5. Aggregate per-portfolio totals + a grand `_total` row.
6. Aggregate per-category totals across portfolios.
7. Write `stock_holdings`, `portfolio_totals`, and `category_totals` as a single batched payload.
8. Log a single summary line.

#### `resolve_config(args)`

Merges the TOML file with the trigger arguments and validates the result. The TOML path comes from `config_path`; relative paths resolve against the plugin directory (`PLUGIN_DIR`, `INFLUXDB3_PLUGIN_DIR`, or the `VIRTUAL_ENV` parent). Returns a `ResolvedConfig`, raising `ValueError` on any invalid value.

### Measurements and fields

#### `stock_holdings`

One row per symbol per successful fetch. Carry-forward symbols are NOT written here (their last fresh row remains the most recent record in this measurement).

- **Tags**: `symbol`, `portfolio`, `asset_type` (`equity`, `etf`, `mutualfund`, `other`), `category` (omitted if portfolio is uncategorized)
- **Fields**: `price`, `quantity`, `value`, `currency`, `previous_close`, `day_open`, `day_high`, `day_low`

#### `portfolio_totals`

One row per configured portfolio plus a `_total` grand-total row, written every tick.

- **Tags**: `portfolio`, `category` (omitted if uncategorized; always omitted on `_total`)
- **Fields**: `value`, `symbol_count`, `missing_symbols`, `skipped_symbols`, `carried_symbols`

#### `category_totals`

One row per defined category, rolled up across portfolios in that category. Uncategorized portfolios and the `_total` row are excluded to avoid double-counting.

- **Tags**: `category`
- **Fields**: `value`, `symbol_count`, `portfolio_count`, `missing_symbols`, `skipped_symbols`, `carried_symbols`

### Internal cache keys

The plugin uses `influxdb3_local.cache` (no TTL) for state across runs:

| Key                          | Value           | Purpose                                                                                                       |
|------------------------------|-----------------|---------------------------------------------------------------------------------------------------------------|
| `asset_type:<SYMBOL>`        | string          | Cached `yfinance.fast_info.quote_type` so we don't re-derive it each run.                                     |
| `last_mf_date:<SYMBOL>`      | `YYYY-MM-DD` (ET) | Last calendar day a mutual fund was fetched. Used to enforce once-per-day NAV polling.                        |
| `last_price:<SYMBOL>`        | float           | Last known price. Used to carry forward portfolio value when a symbol is skipped.                             |

Cache is cleared on server restart. The plugin self-bootstraps: any symbol with a missing cache key gets a fresh fetch on its next tick regardless of skip rules.

## Troubleshooting

### Common issues

#### Issue: No holdings are configured

**Solution:** With no `portfolio` argument and no TOML file, the plugin uses the default holdings `AAPL:1|MSFT:1|GOOG:1`. To track your own holdings, provide `portfolio` trigger arguments or a TOML file with at least one `[holdings.<portfolio>]` table. If you use a TOML file, confirm that `config_path` points to the file in the {{% product-name %}} plugin directory.

#### Issue: Market-hours checks skip expected writes

**Solution:** Set `write_during_closed_hours = true` or choose the correct `market_calendar` and `market_timezone` for your exchange.

When `write_during_closed_hours` is false, the plugin uses `pandas_market_calendars` to skip equity and ETF fetches outside the configured exchange session. Mutual funds are still gated by `mutual_fund_check_time`.

#### Issue: Yahoo Finance returns missing prices

**Solution:** Verify the ticker symbol and check whether Yahoo Finance exposes current price data for that instrument.

A symbol whose price is missing or not a finite number is counted as a fetch failure and reported in the summary log; the optional `previous_close`, `day_open`, `day_high`, and `day_low` fields are simply omitted when unusable. The plugin carries forward the last known price for intentionally skipped symbols, but it cannot value a new holding until the first successful fetch.

### Debugging tips

Check `system.processing_engine_logs` for the trigger summary line. It reports fetched, skipped, carried, and missing symbol counts for each scheduled run.


## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->

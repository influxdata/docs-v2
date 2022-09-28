---
title: Use the Flux LSP with Vim
description: >
  Use the Flux LSP with Vim to add auto-completion, syntax checking, and other language-specific features to your editor.
menu:
  influxdb_2_0:
    parent: Tools & integrations
weight: 102
---

## Requirements

- Vim 8+
- [npm](https://www.npmjs.com/get-npm)

## Install the Flux plugin

There are many ways to install and manage Vim plugins.
We recommend either of the following two methods:

- [Install with vim-lsp](#install-with-vim-lsp)
- [Install with vim-coc](#install-with-vim-coc)

Both methods require you to add the following to your `.vimrc` so that Vim can recognize the `.flux` file type:

```
" Flux file type
au BufRead,BufNewFile *.flux		set filetype=flux
```

### Install with vim-lsp

1. **Install `flux-lsp-cli` with npm**

    ```sh
    npm i -g @influxdata/flux-lsp-cli
    ```

2. **Install [vim-lsp](https://github.com/prabirshrestha/vim-lsp)**

    If it doesn't exist yet, create a directory called `pack/$USER/start/` in your `~/.vim/` and clone `vim-lsp` into it:

    ```sh
    cd ~
    mkdir -p .vim/pack/$USER/start/
    cd .vim/pack/$USER/start/
    git clone https://github.com/prabirshrestha/vim-lsp
    ```

3. **Edit your `.vimrc`**

    Next, edit your `.vimrc` configuration file to include the following:

    ```
    let g:lsp_diagnostics_enabled = 1

    if executable('flux-lsp')
        au User lsp_setup call lsp#register_server({
            \ 'name': 'flux lsp',
            \ 'cmd': {server_info->[&shell, &shellcmdflag, 'flux-lsp']},
            \ 'whitelist': ['flux'],
            \ })
    endif

    autocmd FileType flux nmap gd <plug>(lsp-definition)
    ```

### Install with vim-coc

1. **Install `flux-lsp-cli` from npm**

    ```sh
    npm i -g @influxdata/flux-lsp-cli
    ```
2. **Install plug-vim**

    [Install plug-vim](https://github.com/junegunn/vim-plug#installation), a plugin manager for Vim.

3. **Install vim-coc**

    [Install vim-coc](https://github.com/neoclide/coc.nvim#quick-start), a code-completion plugin for Vim.

4. **Configure vim-coc**

    vim-coc uses a `coc-settings.json` located in your `~/.vim/` directory.
    To run the Flux LSP, add the Flux section under `languageserver`:

    ```json
    {
      "languageserver": {
          "flux": {
            "command": "flux-lsp",
            "filetypes": ["flux"]
          }
      }
    }
    ```

    To debug flux-lsp, configure it to log to `/tmp/fluxlsp`:

    ```json
    {
      "languageserver": {
          "flux": {
            "command": "flux-lsp",
            "args": ["-l", "/tmp/fluxlsp"],
            "filetypes": ["flux"]
          }
      }
    }
    ```

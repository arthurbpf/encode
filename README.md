# Smart contract da aplicação Encode

## Descrição

Este repositório contém o frontend da aplicação Encode.

Este arquivo irá detalhar os passos necessários para rodar a aplicação localmente

A aplicação também está disponível em: https://tcc.arthurbpf.com

## Pré-requisitos

### Pinata

Para utilizar a aplicação é necessário ter uma conta na Pinata. Para criar uma conta, siga as instruções presentes no [site oficial](https://pinata.cloud).

Após criar a conta, crie uma nova chave para o projeto e copie os `API Key` e o `API Secret` para um arquivo `.env.local` na raiz do projeto, com as seguintes variáveis:

```
PINATA_API_KEY="API Key"
PINATA_SECRET_API_KEY="API Secret"
```

### Metamask

Para utilizar a aplicação é necessário ter o Metamask instalado no navegador. Para instalar o Metamask, siga as instruções presentes no [site oficial](https://metamask.io/download.html).

### Contrato inteligente

Caso queira alterar o endereco do contrato inteligente, altere a variável `NEXT_PUBLIC_CONTRACT_ADDRESS` no arquivo `.env` para o endereço do contrato inteligente desejado.

### Node.js e pnpm

Para utilizar a aplicação é necesário o Node.js instalado na máquina. Para o desenvolvimento, foi utilizada a versão 20.2.

É necessário também o gerenciador de pacotes pnpm, que pode ser instalado através do comando `npm install -g pnpm` ou através das orientações presentes na [documentação oficial](https://pnpm.io/installation).

Com o Node.js e o pnpm instalados, execute o comando `pnpm install` na pasta raiz para instalar as dependências do projeto.

Após instalar as dependências, execute o comando `pnpm dev` para iniciar o servidor de desenvolvimento.

Caso deseje rodar uma versão de produção, execute o comando `pnpm build` para gerar os arquivos de produção e `pnpm start` para iniciar o servidor de produção.

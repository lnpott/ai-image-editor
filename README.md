# AI Image Editor

Editor de imagens com IA usando Next.js, Sharp e Google Gemini.

## Funcionalidades

- **Cortar imagem**: Seleção visual com zoom e proporções predefinidas (1:1, 16:9, 4:3, livre)
- **Auto Melhorar**: Ajuste automático de iluminação, brilho, contraste e saturação
- **Aumentar Resolução**: Upscale de imagem com sharpening
- **Chat IA**: Interface conversacional para comandos de edição
- **Download**: Baixar imagem editada em alta qualidade

## Configuração

### Variáveis de Ambiente

Configure a seguinte variável de ambiente no Vercel ou localmente:

```
GEMINI_API_KEY=sua_chave_aqui
```

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy no Vercel

1. Conecte o repositório ao Vercel
2. Configure a variável de ambiente `GEMINI_API_KEY` nas configurações do projeto
3. Deploy automático ao fazer push

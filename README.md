# Transporte
## Instruções de Instalação e Execução

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/transporte.git
    cd transporte
    ```

2. **Instale as dependências**:
    ```bash
    npm install
    ```

3. **Execute o projeto**:
    ```bash
    ng serve
    ```
    O projeto estará disponível em `http://localhost:4200`.

---

## Funcionalidades Implementadas

- Cadastro e gerenciamento de transportes.
- Visualização de detalhes de transporte.
- Filtros e busca avançada.
- Integração com APIs ([transporte-api](https://github.com/GiovaneRobertiTafine/transporte-api)) externas para dados dinâmicos.

---

## Diferenciais

- **Integração com API/Back-end**: Comunicação eficiente com serviços externos para dados atualizados.
- **Lazy Loading**: Carregamento sob demanda para otimização de desempenho.
- **Testes Unitários**: Cobertura de testes para garantir a qualidade do código.
- **Responsividade e Acessibilidade**: Interface adaptável para diferentes dispositivos e tamanhos de tela.

## Pages

- **Dashboard de Entregas:**
Apresenta dados mínimos das entregas contendo filtro para busca com campos status e código/cliente.
Acesso ao detalhe da entrega clicando em uma linha ou em uma entrega na tabela.
![detalhar-entrega](./src/assets/doc/detalhar-entrega.PNG)

- **Detalhes da Entrega:**
Visualiza os detalhes da entrega junto com histórico de status, incluindo função para alterar status.

- **Nova Entrega:**
Comptempla um formulário para inserir uma nova entrega.

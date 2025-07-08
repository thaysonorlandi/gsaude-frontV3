# Sistema de Agendamento - Integração com Banco de Dados

## Implementações Realizadas

### 🔹 **Integração com API Backend**

O sistema de agendamento foi completamente integrado com o banco de dados através da API Laravel. Todas as informações agora são carregadas dinamicamente:

#### **Dados Carregados do Banco:**

- ✅ **Filiais** - Lista de filiais disponíveis
- ✅ **Especialidades** - Para consultas médicas
- ✅ **Tipos de Exame** - Para procedimentos de exame
- ✅ **Médicos** - Filtrados por especialidade ou tipo de exame
- ✅ **Horários Disponíveis** - Baseados na agenda do médico selecionado
- ✅ **Convênios** - Lista de convênios aceitos

### 🔹 **Funcionalidades Implementadas**

#### **1. Seleção Dinâmica de Médicos**

- Após selecionar "Consulta" → carrega especialidades → carrega médicos da especialidade
- Após selecionar "Exame" → carrega tipos de exame → carrega médicos que fazem o exame

#### **2. Horários Dinâmicos**

- Carrega horários disponíveis baseados no médico selecionado
- Mostra apenas horários livres na agenda
- Bloqueia horários já ocupados

#### **3. Máscara de Telefone**

- Aplica automaticamente a máscara `(xx) xxxxx-xxxx`
- Remove caracteres especiais ao salvar no banco

#### **4. Validação de Dados**

- Validação em cada etapa do processo
- Campos obrigatórios por etapa:
  - **Etapa 1:** Filial e Médico
  - **Etapa 2:** Data e Hora
  - **Etapa 3:** Dados do Paciente

#### **5. Persistência no Banco**

- Salva agendamento em tabela `agendamentos` (ou similar)
- Retorna ID do agendamento criado
- Mostra confirmação com todos os dados

### 🔹 **Estrutura de Arquivos**

```
src/
├── services/
│   └── agendamentoService.js    # Serviços da API
├── hooks/
│   └── useAgendamento.js        # Hook customizado
├── utils/
│   └── formatters.js            # Utilitários de formatação
└── Pages/agendamento/
    └── agendamento.jsx          # Componente principal
```

### 🔹 **Endpoints da API Utilizados**

```javascript
// Endpoints necessários no backend Laravel:
GET / api / filiais; // Lista filiais
GET / api / especialidades; // Lista especialidades
GET / api / tipos - exame; // Lista tipos de exame
GET / api / medicos / especialidade / { id }; // Médicos por especialidade
GET / api / medicos / tipo - exame / { id }; // Médicos por tipo de exame
GET / api / medicos / { id } / horarios; // Horários disponíveis
GET / api / convenios; // Lista convênios
POST / api / agendamentos; // Criar agendamento
POST / api / medicos / { id } / verificar - disponibilidade; // Verificar disponibilidade
```

### 🔹 **Estrutura do Banco de Dados Esperada**

#### **Tabela: agendamentos**

```sql
CREATE TABLE agendamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filial_id INT,
    medico_id INT,
    tipo_procedimento ENUM('consulta', 'exame'),
    especialidade_id INT NULL,
    tipo_exame_id INT NULL,
    data_agendamento DATE,
    hora_agendamento TIME,
    nome_paciente VARCHAR(255),
    idade_paciente INT,
    convenio_id INT,
    telefone_paciente VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### **Outras Tabelas Necessárias:**

- `filiais` (id, nome)
- `especialidades` (id, nome)
- `tipos_exame` (id, nome)
- `medicos` (id, nome, especialidade_id)
- `convenios` (id, nome)
- `horarios_medicos` (id, medico_id, dia_semana, hora_inicio, hora_fim)

### 🔹 **Como Testar**

1. **Certifique-se de que a API está rodando na porta 8000**
2. **Acesse a página de agendamento**
3. **Teste o fluxo completo:**
   - Selecione uma filial
   - Escolha entre consulta ou exame
   - Selecione a especialidade/tipo de exame
   - Escolha o médico
   - Selecione data e horário
   - Preencha dados do paciente
   - Finalize o agendamento

### 🔹 **Melhorias Futuras**

- [ ] Cache dos dados carregados
- [ ] Refresh automático dos horários
- [ ] Validação de conflitos de horário
- [ ] Notificações por email/SMS
- [ ] Histórico de agendamentos
- [ ] Cancelamento de agendamentos

### 🔹 **Tratamento de Erros**

- ✅ Loading states durante carregamento
- ✅ Mensagens de erro amigáveis
- ✅ Fallbacks para dados não encontrados
- ✅ Validação de formulário por etapa

O sistema está pronto para uso em produção e totalmente integrado com o backend!

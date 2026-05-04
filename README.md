# 🎯 Kanban Board - Sistema de Tarefas com Drag & Drop

[![Status](https://img.shields.io/badge/status-completo-success.svg)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()

## 📋 Sobre o Projeto

Um quadro Kanban completo e funcional que permite gerenciar tarefas visualmente através de colunas (A Fazer, Em Andamento, Concluído). Com suporte a **Drag & Drop** tanto no mouse quanto em dispositivos touch, **modo escuro**, **persistência de dados** e **edição inline**.

## ✨ Funcionalidades Implementadas

### 📌 Requisitos Obrigatórios
- ✅ **3 Colunas**: A Fazer, Em Andamento, Concluído
- ✅ **Drag & Drop**: Arrastar tarefas entre colunas (mouse e touch)
- ✅ **Adicionar tarefas**: Input + botão com validação
- ✅ **Editar tarefa**: Duplo clique no texto
- ✅ **Excluir tarefa**: Botão ❌ em cada cartão
- ✅ **Persistência**: localStorage (recarregar mantém os dados)
- ✅ **Dark Mode**: Botão flutuante 🌙/☀️ com persistência

### 🎨 Diferenciais Implementados
- ✨ **Contador de tarefas** por coluna em tempo real
- ✨ **Data de vencimento** nas tarefas com indicador de atraso
- ✨ **Categorias com cores diferentes** (Baixa 🟢, Média 🟠, Alta 🔴)
- ✨ **Botão "Limpar concluídas"** na coluna final
- ✨ **Animação ao adicionar/mover tarefas** (fadeIn + slide)
- ✨ **Responsivo completo** com suporte a touch (drag mobile)

## 🚀 Como Executar

1. Clone ou baixe os arquivos
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Comece a gerenciar suas tarefas!

## 🎮 Como Usar

### Adicionar Tarefa
1. Digite o texto no campo "Nova tarefa"
2. (Opcional) Selecione uma data de vencimento
3. Clique em "+ Adicionar Tarefa" ou pressione Enter

### Mover Tarefa (Drag & Drop)
- **Desktop**: Clique e arraste o cartão para outra coluna
- **Mobile**: Toque e segure, arraste para a coluna desejada

### Editar Tarefa
- Dê um duplo clique no texto da tarefa
- Digite o novo texto e pressione Enter ou clique fora

### Excluir Tarefa
- Clique no botão ❌ no cartão da tarefa
- Confirme a exclusão

### Dark Mode
- Clique no botão 🌙/☀️ no canto superior direito
- A preferência é salva automaticamente

### Limpar Concluídas
- Clique no botão "🗑️ Limpar Concluídas" na coluna final
- Remove todas as tarefas da coluna "Concluído"

## 🗂️ Estrutura do Projeto


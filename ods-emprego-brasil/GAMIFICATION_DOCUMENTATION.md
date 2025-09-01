# Documentação do Sistema de Gamificação

## Visão Geral

O sistema de gamificação foi implementado para aumentar o engajamento dos usuários na plataforma ODS Emprego Brasil, incentivando a exploração de oportunidades de emprego e o desenvolvimento profissional através de elementos de jogo.

## Componentes Principais

### 1. Sistema de Pontuação

- **Pontos por Ação**: Cada interação do usuário gera pontos
- **Multiplicadores**: Baseados no nível atual do usuário
- **Streak**: Bônus por dias consecutivos de uso

### 2. Sistema de Níveis

| Nível | Pontos Necessários | Título |
|-------|-------------------|--------|
| 1 | 0 | Iniciante |
| 2 | 100 | Explorador |
| 3 | 250 | Pesquisador |
| 4 | 500 | Analista |
| 5 | 1000 | Especialista |
| 6 | 2000 | Expert |
| 7 | 3500 | Mestre |
| 8 | 5500 | Guru |
| 9 | 8000 | Lenda |
| 10 | 12000 | Mestre da Busca |

### 3. Sistema de Conquistas

#### Conquistas Comuns
- **Primeiro Passo** (search): Realizou sua primeira busca por emprego
- **Bem Informado** (newspaper): Leu 5 notícias sobre emprego
- **Explorador de Carreiras** (explore): Explorou trilhas de carreira

#### Conquistas Raras
- **Caçador de Vagas** (track_changes): Visualizou 10 vagas de emprego
- **Guerreiro da Consistência** (local_fire_department): Manteve um streak de 7 dias
- **Analista de Dados** (bar_chart): Explorou todas as estatísticas de desemprego

#### Conquistas Épicas
- **Planejador de Carreira** (map): Completou o mapa mental de carreira

#### Conquistas Lendárias
- **Mestre da Busca** (workspace_premium): Alcançou o nível 10

### 4. Sistema de Streak

- **Contador de Dias Consecutivos**: Rastreia o uso diário da plataforma
- **Bônus de Pontos**: Multiplicador baseado no streak atual
- **Reset**: Streak é resetado se o usuário não acessar por mais de 24 horas

## Ações que Geram Pontos

| Ação | Pontos Base | Descrição |
|------|-------------|----------|
| Buscar Vagas | 10 | Realizar uma busca por vagas de emprego |
| Visualizar Vaga | 5 | Abrir detalhes de uma vaga específica |
| Ler Notícia | 8 | Ler uma notícia sobre emprego |
| Explorar Estatísticas | 15 | Visualizar dados de desemprego |
| Usar Mapa de Carreira | 20 | Interagir com o mapa mental de carreiras |
| Análise Custo-Benefício | 25 | Usar a ferramenta de análise de investimento |
| Login Diário | 5 | Bônus por acessar a plataforma |

## Implementação Técnica

### Serviço Principal

```typescript
@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  // Gerencia pontos, níveis, conquistas e streak
}
```

### Armazenamento

- **LocalStorage**: Dados persistidos localmente no navegador
- **Chaves de Armazenamento**:
  - `gamification_data`: Dados principais do usuário
  - `user_streak`: Informações do streak
  - `achievements`: Estado das conquistas

### Componente de Interface

```typescript
@Component({
  selector: 'app-gamification-panel',
  // Interface visual para exibir progresso
})
export class GamificationPanelComponent {
  // Exibe nível, pontos, conquistas e streak
}
```

## Fluxo de Funcionamento

1. **Inicialização**: Sistema carrega dados salvos ou cria perfil novo
2. **Ação do Usuário**: Usuário realiza uma ação na plataforma
3. **Cálculo de Pontos**: Sistema calcula pontos baseado na ação e multiplicadores
4. **Atualização de Nível**: Verifica se usuário subiu de nível
5. **Verificação de Conquistas**: Checa se alguma conquista foi desbloqueada
6. **Atualização de Streak**: Atualiza contador de dias consecutivos
7. **Persistência**: Salva dados atualizados no localStorage
8. **Notificação**: Exibe feedback visual para o usuário

## Benefícios do Sistema

### Para o Usuário
- **Motivação**: Incentiva o uso regular da plataforma
- **Progresso Visual**: Mostra evolução no uso das ferramentas
- **Reconhecimento**: Conquistas validam o esforço do usuário
- **Descoberta**: Encoraja exploração de todas as funcionalidades

### Para a Plataforma
- **Engajamento**: Aumenta tempo de permanência
- **Retenção**: Incentiva retorno regular dos usuários
- **Exploração**: Usuários descobrem mais funcionalidades
- **Dados**: Coleta informações sobre padrões de uso

## Futuras Melhorias

### Funcionalidades Planejadas
- **Ranking Global**: Comparação entre usuários
- **Conquistas Sazonais**: Eventos temporários
- **Badges Personalizados**: Conquistas específicas por área
- **Sistema de Recompensas**: Benefícios tangíveis por progresso
- **Integração Social**: Compartilhamento de conquistas
- **Desafios Semanais**: Metas específicas com recompensas

### Melhorias Técnicas
- **Backend Integration**: Sincronização com servidor
- **Analytics Avançado**: Métricas detalhadas de engajamento
- **Personalização**: Sistema adaptativo baseado no comportamento
- **Notificações Push**: Lembretes e celebrações

## Considerações de UX

### Princípios Aplicados
- **Feedback Imediato**: Resposta visual instantânea às ações
- **Progressão Clara**: Indicadores visuais de progresso
- **Celebração**: Animações e notificações para conquistas
- **Não Intrusivo**: Sistema complementa, não atrapalha o uso
- **Opcional**: Usuário pode desabilitar se preferir

### Elementos Visuais
- **Ícones Material Design**: Consistência visual
- **Cores Temáticas**: Integração com design system
- **Animações Sutis**: Feedback visual sem distração
- **Tipografia Clara**: Informações fáceis de ler

## Métricas de Sucesso

### KPIs Principais
- **Taxa de Retenção**: Usuários que retornam regularmente
- **Tempo de Sessão**: Duração média de uso
- **Exploração de Funcionalidades**: Uso de diferentes seções
- **Conquistas Desbloqueadas**: Progresso dos usuários
- **Streak Médio**: Consistência de uso

### Análise de Dados
- **Padrões de Uso**: Identificação de funcionalidades mais populares
- **Pontos de Abandono**: Onde usuários param de progredir
- **Efetividade**: Correlação entre gamificação e objetivos de emprego
- **Feedback Qualitativo**: Pesquisas de satisfação

---

*Documentação criada em: Janeiro 2025*
*Versão: 1.0*
*Autor: Sistema de Gamificação ODS Emprego Brasil*
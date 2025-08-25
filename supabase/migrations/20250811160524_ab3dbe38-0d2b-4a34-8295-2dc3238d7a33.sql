-- Seed only: insert active legal documents if missing
insert into public.legal_documents (doc_type, version, content, summary, active)
select * from (values
  (
    'cliente_termos',
    '2025-08-11',
    $$TERMO DE USO – CLIENTE

1. Objeto
O Zurbo é uma plataforma online que conecta clientes a prestadores de serviços autônomos, permitindo a solicitação, agendamento e pagamento de serviços.

2. Cadastro e Acesso
- O usuário deve fornecer informações verídicas.
- O uso é restrito a maiores de 18 anos ou emancipados legalmente.
- É vedada a criação de contas múltiplas para fins abusivos.

3. Pagamentos
- Os pagamentos são processados via Stripe (escrow), liberados ao prestador somente após a conclusão confirmada do serviço.
- Cancelamentos seguem a política de reembolso publicada.

4. Limites de uso
- Cada cliente pode criar até 3 pedidos por hora. Após exceder, será bloqueado por 6h, com opção de contato com o suporte.

5. Responsabilidades do Cliente
- Fornecer informações corretas sobre o serviço solicitado.
- Não contratar serviços ilícitos, perigosos ou proibidos por lei.
- Respeitar prestadores e demais usuários, evitando comportamento abusivo.

6. Garantias e Limitações
- O Zurbo não garante a qualidade do serviço prestado, que é de responsabilidade exclusiva do prestador.
- O Zurbo poderá intermediar disputas, mas não se responsabiliza por danos diretos ou indiretos decorrentes do serviço.

7. Privacidade
- Os dados do usuário serão tratados conforme a LGPD.
- Informações pessoais só serão compartilhadas quando estritamente necessário para execução do serviço.

8. Penalidades
- Violação das regras poderá resultar em suspensão ou banimento.
- Tentativas de pagamento por fora da plataforma resultarão em bloqueio imediato.

9. Alterações
- O Zurbo poderá atualizar estes termos, notificando o usuário com antecedência mínima de 10 dias.
$$,
    $$Cliente – Resumo\n\n- O Zurbo conecta clientes a prestadores autônomos.\n- Pagamento seguro via Stripe Escrow.\n- Máx. 3 pedidos/hora; exceder = bloqueio 6h.\n- Cancelamentos e reembolsos seguem regras publicadas.\n- Uso abusivo pode gerar banimento.\n\n[Ver versão completa]$$,
    true
  ),
  (
    'prestador_contrato',
    '2025-08-11',
    $$CONTRATO DE PRESTAÇÃO DE SERVIÇOS AUTÔNOMOS – PRESTADOR

1. Objeto
O presente contrato regula a atuação do prestador de serviços como usuário da plataforma Zurbo.

2. Natureza da Relação
- O prestador atua de forma autônoma, sem vínculo empregatício com o Zurbo.
- O Zurbo é apenas intermediador tecnológico e processador de pagamentos.

3. Cadastro e Validação
O prestador deve fornecer:
- Documento oficial com foto
- Selfie para verificação facial
- Dados bancários válidos
A conta só será liberada para receber chamados após validação dos documentos.

4. Pagamentos
- Processados via Stripe Escrow.
- Liberação até 5 dias úteis após a conclusão confirmada do serviço.
- Comissão do Zurbo: 8% sobre o valor do serviço.
- Pagamentos por fora resultam em:
  • Bloqueio de conta
  • Multa de 20% sobre o valor estimado
- Dados bancários devem estar sempre atualizados.

5. Obrigações do Prestador
- Comparecer aos serviços aceitos ou cancelar com antecedência mínima definida.
- Cumprir com a qualidade e especificações combinadas.
- Não oferecer serviços ilícitos.

6. Penalidades
- Faltas não justificadas → multa de X% sobre o valor do serviço.
- Reclamações recorrentes de má conduta ou qualidade → suspensão ou banimento.

7. Disputas
Em caso de divergência, o valor ficará retido até resolução pela equipe do Zurbo.

8. Alterações
O Zurbo poderá atualizar este contrato, com aviso prévio de 10 dias.
$$,
    $$Prestador – Resumo\n\n- Atuação como autônomo, sem vínculo empregatício.\n- Recebe via Stripe Escrow, após prazo de segurança.\n- Comissão do Zurbo: 8% do valor.\n- Necessário validar documentos antes de receber pedidos.\n- Pagamentos por fora → multa e banimento.\n\n[Ver versão completa]$$,
    true
  )
) as v(doc_type, version, content, summary, active)
where not exists (
  select 1 from public.legal_documents d
  where d.doc_type = v.doc_type and d.version = v.version
);

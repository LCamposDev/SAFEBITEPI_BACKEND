/**
 * Script de teste para recuperação de senha
 * Execute: node tests/test-password-reset.js
 */

require('dotenv').config();
const http = require('http');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
let resetToken = null;
let testEmail = null;

// Função auxiliar para fazer requisições HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = http.request(url, options, res => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Função para imprimir resultados
function printResult(testName, result, expectedStatus = 200) {
  const status = result.status === expectedStatus ? '✅' : '❌';
  console.log(`${status} ${testName}`);
  console.log(`   Status: ${result.status} (esperado: ${expectedStatus})`);
  if (result.status !== expectedStatus || process.env.VERBOSE === 'true') {
    if (typeof result.data === 'object') {
      console.log(`   Resposta:`, JSON.stringify(result.data, null, 2));
    } else {
      console.log(`   Resposta: ${result.data}`);
    }
  }
  console.log('');
}

// Executar testes
async function runTests() {
  console.log('🧪 Iniciando testes de recuperação de senha...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  try {
    // Primeiro, criar um usuário de teste ou usar um existente
    console.log('📋 Preparação: Criando usuário de teste...');
    testEmail = `teste_reset_${Date.now()}@teste.com`;
    const registerData = {
      nome_completo: 'Teste Reset Senha',
      email: testEmail,
      senha: 'senha_antiga_123',
      telefone: '11999999999'
    };

    const registerResult = await makeRequest('POST', '/api/auth/register', registerData);
    if (registerResult.status === 201) {
      console.log(`✅ Usuário criado: ${testEmail}\n`);
    } else if (registerResult.status === 409) {
      console.log(`⚠️  Usuário já existe, usando: ${testEmail}\n`);
    } else {
      console.log(`❌ Erro ao criar usuário. Continuando com testes...\n`);
    }

    // Teste 1: Solicitar recuperação de senha
    console.log('📋 Teste 1: Solicitar Recuperação de Senha');
    const forgotPasswordData = {
      email: testEmail
    };
    const forgotResult = await makeRequest('POST', '/api/auth/forgot-password', forgotPasswordData);
    printResult('Solicitar Recuperação', forgotResult, 200);

    if (forgotResult.status === 200) {
      console.log('   💡 Verifique o console do servidor para ver o token gerado');
      console.log('   💡 Ou verifique o email (se configurado)\n');
    }

    // Obter token do banco (simulação - em produção você pegaria do email)
    console.log('📋 Teste 2: Verificar Token (precisa do token do email/console)');
    console.log('   ⚠️  Para este teste funcionar completamente, você precisa:');
    console.log('      1. Verificar o console do servidor para ver o token gerado');
    console.log('      2. Ou configurar email e verificar sua caixa de entrada');
    console.log('      3. Ou consultar o banco de dados diretamente\n');

    // Teste 3: Solicitar recuperação com email inválido
    console.log('📋 Teste 3: Solicitar Recuperação com Email Inválido');
    const invalidEmailData = {
      email: 'email_inexistente@teste.com'
    };
    const invalidEmailResult = await makeRequest(
      'POST',
      '/api/auth/forgot-password',
      invalidEmailData
    );
    printResult('Email Inválido (deve retornar sucesso por segurança)', invalidEmailResult, 200);

    // Teste 4: Validação de dados inválidos
    console.log('📋 Teste 4: Validação de Dados Inválidos');
    const invalidData = {
      email: 'email-invalido'
    };
    const validationResult = await makeRequest('POST', '/api/auth/forgot-password', invalidData);
    printResult('Validação de Email Inválido', validationResult, 400);

    // Teste 5: Verificar token inválido
    console.log('📋 Teste 5: Verificar Token Inválido');
    const invalidTokenData = {
      token: 'token_invalido_12345'
    };
    const invalidTokenResult = await makeRequest(
      'POST',
      '/api/auth/verify-reset-token',
      invalidTokenData
    );
    printResult('Token Inválido', invalidTokenResult, 400);

    // Teste 6: Redefinir senha sem token
    console.log('📋 Teste 6: Redefinir Senha sem Token');
    const noTokenData = {
      senha: 'nova_senha_123'
    };
    const noTokenResult = await makeRequest('POST', '/api/auth/reset-password', noTokenData);
    printResult('Sem Token', noTokenResult, 400);

    // Teste 7: Redefinir senha com senha inválida
    console.log('📋 Teste 7: Redefinir Senha com Senha Inválida');
    const invalidPasswordData = {
      token: 'token_teste',
      senha: '123' // Senha muito curta
    };
    const invalidPasswordResult = await makeRequest(
      'POST',
      '/api/auth/reset-password',
      invalidPasswordData
    );
    printResult('Senha Inválida', invalidPasswordResult, 400);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Testes básicos concluídos!\n');
    console.log('📝 Próximos passos para teste completo:');
    console.log('   1. Solicite recuperação de senha para um email cadastrado');
    console.log('   2. Verifique o console do servidor (modo dev) ou seu email');
    console.log('   3. Use o token recebido para testar verify-reset-token');
    console.log('   4. Use o token para redefinir a senha');
    console.log('   5. Teste fazer login com a nova senha\n');

    console.log('💡 Dica: Para ver o token no console, verifique os logs do servidor');
    console.log('   quando executar POST /api/auth/forgot-password\n');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    const result = await makeRequest('GET', '/api/health');
    return result.status === 200;
  } catch (error) {
    return false;
  }
}

// Iniciar testes
(async () => {
  console.log('🔍 Verificando se o servidor está rodando...\n');
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.error('❌ Servidor não está rodando!');
    console.error('   Por favor, inicie o servidor com: npm run dev');
    process.exit(1);
  }

  console.log('✅ Servidor está rodando!\n');
  await runTests();
})();

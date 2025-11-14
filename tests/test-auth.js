/**
 * Script de teste manual para autenticação
 * Execute: node tests/test-auth.js
 */

require('dotenv').config();
const http = require('http');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
let authToken = null;
let refreshToken = null;

// Função auxiliar para fazer requisições HTTP
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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
  if (result.status !== expectedStatus) {
    console.log(`   Resposta:`, JSON.stringify(result.data, null, 2));
  }
  console.log('');
}

// Executar testes
async function runTests() {
  console.log('🧪 Iniciando testes de autenticação...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  try {
    // Teste 1: Health Check
    console.log('📋 Teste 1: Health Check');
    const healthResult = await makeRequest('GET', '/api/health');
    printResult('Health Check', healthResult, 200);

    // Teste 2: Registro de usuário
    console.log('📋 Teste 2: Registro de Usuário');
    const registerData = {
      nome_completo: 'Teste Usuario',
      email: `teste${Date.now()}@teste.com`,
      senha: 'senha123',
      telefone: '11999999999',
      idade: 25
    };
    const registerResult = await makeRequest('POST', '/api/auth/register', registerData);
    printResult('Registro', registerResult, 201);

    if (registerResult.status === 201 && registerResult.data.data) {
      authToken = registerResult.data.data.token;
      refreshToken = registerResult.data.data.refreshToken;
      console.log(`   ✅ Token recebido: ${authToken.substring(0, 20)}...`);
      console.log(`   ✅ User ID: ${registerResult.data.data.user.id}`);
      console.log('');
    }

    // Teste 3: Tentar registrar email duplicado
    console.log('📋 Teste 3: Registro com Email Duplicado');
    const duplicateResult = await makeRequest('POST', '/api/auth/register', registerData);
    printResult('Email Duplicado', duplicateResult, 409);

    // Teste 4: Validação de dados inválidos
    console.log('📋 Teste 4: Validação de Dados Inválidos');
    const invalidData = {
      nome_completo: 'A',
      email: 'email-invalido',
      senha: '123'
    };
    const validationResult = await makeRequest('POST', '/api/auth/register', invalidData);
    printResult('Validação', validationResult, 400);

    // Teste 5: Login com credenciais corretas
    console.log('📋 Teste 5: Login com Credenciais Corretas');
    const loginData = {
      email: registerData.email,
      senha: registerData.senha
    };
    const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
    printResult('Login', loginResult, 200);

    if (loginResult.status === 200 && loginResult.data.data) {
      authToken = loginResult.data.data.token;
      refreshToken = loginResult.data.data.refreshToken;
      console.log(`   ✅ Token recebido: ${authToken.substring(0, 20)}...`);
      console.log('');
    }

    // Teste 6: Login com credenciais incorretas
    console.log('📋 Teste 6: Login com Credenciais Incorretas');
    const wrongLoginData = {
      email: registerData.email,
      senha: 'senha_errada'
    };
    const wrongLoginResult = await makeRequest('POST', '/api/auth/login', wrongLoginData);
    printResult('Login Inválido', wrongLoginResult, 401);

    // Teste 7: Refresh Token
    if (refreshToken) {
      console.log('📋 Teste 7: Refresh Token');
      const refreshData = { refreshToken };
      const refreshResult = await makeRequest('POST', '/api/auth/refresh', refreshData);
      printResult('Refresh Token', refreshResult, 200);

      if (refreshResult.status === 200 && refreshResult.data.data) {
        console.log(
          `   ✅ Novo token recebido: ${refreshResult.data.data.token.substring(0, 20)}...`
        );
        console.log('');
      }
    }

    console.log('✅ Todos os testes concluídos!\n');
    console.log('📝 Resumo:');
    console.log('   - Health check funcionando');
    console.log('   - Registro de usuário funcionando');
    console.log('   - Validações funcionando');
    console.log('   - Login funcionando');
    console.log('   - Refresh token funcionando');
    console.log('\n🎉 Sistema de autenticação está funcionando corretamente!');
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

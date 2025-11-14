/**
 * Script para testar rota protegida
 * Primeiro, crie a rota de teste conforme instruções no TESTES.md
 * Execute: node tests/test-protected-route.js
 */

require('dotenv').config();
const http = require('http');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

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

async function testProtectedRoute() {
  console.log('🧪 Testando rota protegida...\n');

  // Primeiro, fazer login para obter token
  console.log('1️⃣ Fazendo login...');
  const loginData = {
    email: 'teste@teste.com', // Use um email que você já registrou
    senha: 'senha123'
  };

  const loginResult = await makeRequest('POST', '/api/auth/login', loginData);

  if (loginResult.status !== 200) {
    console.error('❌ Erro ao fazer login. Por favor, registre um usuário primeiro.');
    console.error('   Resposta:', loginResult.data);
    return;
  }

  const token = loginResult.data.data.token;
  console.log(`✅ Login realizado. Token: ${token.substring(0, 20)}...\n`);

  // Teste 1: Acessar rota protegida SEM token
  console.log('2️⃣ Testando acesso SEM token...');
  const noTokenResult = await makeRequest('GET', '/api/test/protected');
  if (noTokenResult.status === 401) {
    console.log('✅ Rota protegida corretamente (sem token = 401)\n');
  } else {
    console.log('❌ Rota não está protegida corretamente\n');
  }

  // Teste 2: Acessar rota protegida COM token
  console.log('3️⃣ Testando acesso COM token...');
  const withTokenResult = await makeRequest('GET', '/api/test/protected', null, token);
  if (withTokenResult.status === 200) {
    console.log('✅ Rota acessada com sucesso!');
    console.log('   Dados do usuário:', withTokenResult.data.user);
  } else {
    console.log('❌ Erro ao acessar rota protegida');
    console.log('   Resposta:', withTokenResult.data);
  }

  // Teste 3: Acessar com token inválido
  console.log('\n4️⃣ Testando acesso com token inválido...');
  const invalidTokenResult = await makeRequest(
    'GET',
    '/api/test/protected',
    null,
    'token_invalido'
  );
  if (invalidTokenResult.status === 401) {
    console.log('✅ Token inválido rejeitado corretamente');
  } else {
    console.log('❌ Token inválido não foi rejeitado');
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

(async () => {
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.error('❌ Servidor não está rodando!');
    console.error('   Por favor, inicie o servidor com: npm run dev');
    process.exit(1);
  }

  await testProtectedRoute();
})();

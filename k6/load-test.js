
    import http from 'k6/http';
    import { check, sleep } from 'k6';
    
    // Opções do teste
    export const options = {
       stages: [
        // Rampa de subida suave para 500 usuários em 30 segundos
        { duration: '30s', target: 500 },
        // Mantém 500 usuários por 4 minutos
        { duration: '4m', target: 500 },
        // Rampa de descida suave para 0 usuários em 30 segundos
        { duration: '30s', target: 0 },
      ],
      thresholds: {
        'http_req_failed': ['rate<0.01'], // Menos de 1% das requisições podem falhar
        'http_req_duration': ['p(95)<500'], // 95% das requisições devem ser abaixo de 500ms
      },
    };
    
    // Função principal que cada usuário virtual (VU) irá executar
    export default function () {
      // Faz uma requisição GET para a API de teste
      const res = http.get('https://test-api.k6.io/public/crocodiles/');
    
      // Verifica se a requisição foi bem-sucedida
      check(res, {
        'status é 200': (r) => r.status == 200,
      });
    
      // Pausa de 1 segundo entre as requisições de cada usuário
      sleep(1);
    }
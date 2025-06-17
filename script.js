import http from 'k6/http';
import { Trend, Rate } from 'k6/metrics';

export let options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 150 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 250 },
    { duration: '30s', target: 300 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5700'],
    http_req_failed: ['rate<0.12'],
  },
};

let getDuration = new Trend('get_duration');
let successRate = new Rate('successful_requests');

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts/1');

  getDuration.add(res.timings.duration);
  successRate.add(res.status === 200);
}

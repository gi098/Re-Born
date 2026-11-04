/**
 * Vercel Serverless API: /api/categories
 * Lấy danh mục sản phẩm RE-BORN
 */

const https = require('https');

const FALLBACK_CATEGORIES = [
  { id: 'all', name: 'Tất cả', slug: 'all', description: 'Tất cả sản phẩm trong bộ sưu tập' },
  { id: 1, name: 'Nước Rửa Tay', slug: 'nuoc-rua-tay', description: 'Nước rửa tay vỏ bưởi hữu cơ' },
  { id: 2, name: 'Túi Refill', slug: 'tui-refill', description: 'Túi nạp lại tiết kiệm rác nhựa' },
  { id: 3, name: 'Combo Tiết Kiệm', slug: 'combo-qua-tang', description: 'Gói ưu đãi mua chung sinh viên' }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://uovqydazhplufaezjsxd.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jKJ8BoQ1Cdk-9VCedVtvEg_jaLJulOY';

  try {
    const data = await new Promise((resolve, reject) => {
      const url = new URL(`${supabaseUrl}/rest/v1/categories?select=*`);
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json'
        },
        timeout: 3000
      };

      const fetchReq = https.request(options, (resp) => {
        let body = '';
        resp.on('data', chunk => { body += chunk; });
        resp.on('end', () => {
          if (resp.statusCode >= 200 && resp.statusCode < 300) {
            try {
              resolve(JSON.parse(body || '[]'));
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`Status ${resp.statusCode}`));
          }
        });
      });

      fetchReq.on('error', err => reject(err));
      fetchReq.on('timeout', () => {
        fetchReq.destroy();
        reject(new Error('Timeout'));
      });
      fetchReq.end();
    });

    if (Array.isArray(data) && data.length > 0) {
      const categories = [
        { id: 'all', name: 'Tất cả', slug: 'all', description: 'Tất cả sản phẩm' },
        ...data
      ];
      return res.status(200).json({ success: true, count: categories.length, categories, source: 'database' });
    }
    return res.status(200).json({ success: true, count: FALLBACK_CATEGORIES.length, categories: FALLBACK_CATEGORIES, source: 'fallback_empty' });

  } catch (err) {
    return res.status(200).json({ success: true, count: FALLBACK_CATEGORIES.length, categories: FALLBACK_CATEGORIES, source: 'fallback' });
  }
};


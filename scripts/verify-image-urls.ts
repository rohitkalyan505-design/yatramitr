const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/56/Golconda_Fort_005.jpg',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80'
];

async function check() {
  for (const u of urls) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      console.log(`${res.status} : ${u.slice(0, 70)}...`);
    } catch (e: any) {
      console.log(`ERR : ${u} (${e.message})`);
    }
  }
}
check();

const urls = [
  'https://images.unsplash.com/photo-1602293589930-45aad59bc3ab',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1528459801416-a1e53ed07252',
  'https://images.unsplash.com/photo-1554568218-0f1715e72254',
  'https://images.unsplash.com/photo-1550993444-2396e95222bf'
];

async function check() {
  for(let u of urls) {
    try {
      const res = await fetch(u, {method: 'HEAD'});
      console.log(u, res.status);
    } catch(e) { }
  }
}
check();

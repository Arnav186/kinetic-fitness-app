fetch('https://kinetic-fitness-app.vercel.app/api/workout/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'test', duration: 10, calories: 100 })
})
.then(r => r.json())
.then(console.dir)
.catch(console.error);

fetch('https://wpaioptimizer.com/assets/index-DHvTTx5M.js').then(r=>r.text()).then(t=>console.log(t.includes('sendPasswordResetEmail') ? 'YES IT HAS IT' : 'NO IT DOES NOT'))

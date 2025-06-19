const API = 'https://c49e9cb2-49ab-4839-89c2-c70b41573fad-00-1035t9hojo5ss.janeway.replit.dev/api';
let TOKEN = localStorage.getItem('token') || null;

function renderAuth() {
  document.getElementById('auth').innerHTML = `
    <form id="loginForm">
      <input name="username" placeholder="Username" required>
      <input name="password" type="password" placeholder="Password" required>
      <button>Login</button>
    </form>
    <form id="registerForm">
      <input name="username" placeholder="Username" required>
      <input name="password" type="password" placeholder="Password" required>
      <button>Register</button>
    </form>
  `;
  document.getElementById('loginForm').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const res = await fetch(API + '/users/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value
      })
    });
    const data = await res.json();
    if (data.token) {
      TOKEN = data.token;
      localStorage.setItem('token', TOKEN);
      alert('Logged in as ' + data.username);
    } else {
      alert('Login failed');
    }
  };
  document.getElementById('registerForm').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    await fetch(API + '/users/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value
      })
    });
    alert('Registered! Now login.');
  };
}

function renderNewArticle() {
  document.getElementById('new-article').innerHTML = `
    <h2>New Article</h2>
    <form id="articleForm">
      <input name="title" placeholder="Title" required>
      <textarea name="content" placeholder="How to..." required></textarea>
      <input name="categories" placeholder="Categories (comma separated)">
      <button>Submit</button>
    </form>
  `;
  document.getElementById('articleForm').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    await fetch(API + '/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: form.title.value,
        content: form.content.value,
        author: 'Anonymous', // Or use logged-in username if you implement that
        categories: form.categories.value.split(',').map(s => s.trim())
      })
    });
    alert('Article created!');
    loadArticles();
  };
}

async function loadArticles() {
  const res = await fetch(API + '/articles');
  const articles = await res.json();
  document.getElementById('articles').innerHTML = articles.map(a => `
    <div class="article">
      <h3>${a.title}</h3>
      <p>${a.content}</p>
      <small>By: ${a.author} | Categories: ${a.categories.join(', ')}</small>
    </div>
  `).join('');
}

// On load
renderAuth();
renderNewArticle();
loadArticles();

// Функція для отримання всіх постів (корисно для index.html)
async function fetchPosts() {
    const response = await fetch('../data/posts.json');
    return await response.json();
}

// Функція для отримання конкретного посту за ID (корисно для template.html)
async function getPostById(id) {
    const posts = await fetchPosts();
    return posts.find(p => p.id === id);
}
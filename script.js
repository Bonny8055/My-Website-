// Interactive Page Functions
function openInteractivePage() {
  document.getElementById('interactivePage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeInteractivePage() {
  document.getElementById('interactivePage').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside content
document.getElementById('interactivePage').addEventListener('click', function(e) {
  if (e.target === this) {
    closeInteractivePage();
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Load Medium Blog Posts
function loadMediumPosts() {
  const mediumUsername = 'tammalibhanuprakash23';
  const mediumFeed = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`;
  
  fetch(mediumFeed)
    .then(response => response.json())
    .then(data => {
      const postsContainer = document.getElementById('medium-posts');
      postsContainer.innerHTML = '';
      
      if (data.items && data.items.length > 0) {
        data.items.slice(0, 5).forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'blog-post';
          postElement.innerHTML = `
            <h4>${post.title}</h4>
            <p>${new Date(post.pubDate).toLocaleDateString()}</p>
            <a href="${post.link}" target="_blank">
              <i class="fas fa-external-link-alt"></i> Read Article
            </a>
          `;
          postsContainer.appendChild(postElement);
        });
      } else {
        postsContainer.innerHTML = '<p>No articles found. Check back later!</p>';
      }
    })
    .catch(error => {
      console.error('Error loading Medium posts:', error);
      document.getElementById('medium-posts').innerHTML = 
        '<p>Could not load articles at this time. <a href="https://medium.com/@tammalibhanuprakash23" target="_blank">Visit my Medium profile</a></p>';
    });
}

// Achievements System
let achievements = [];

async function loadAchievements() {
  try {
    const response = await fetch('achievements.json');
    achievements = await response.json();
    displayAchievements();
    
    // Check if admin (you can replace this with actual auth later)
    const isAdmin = localStorage.getItem('portfolioAdmin') === 'true';
    if (isAdmin) {
      document.getElementById('adminActions').style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
    document.getElementById('achievementsTimeline').innerHTML = 
      '<p>Could not load achievements at this time.</p>';
  }
}

function displayAchievements() {
  const timeline = document.getElementById('achievementsTimeline');
  timeline.innerHTML = '';
  
  // Sort by date (newest first)
  const sortedAchievements = [...achievements].sort((a, b) => 
    new Date(b.date) - new Date(a.date));
  
  sortedAchievements.forEach((achievement, index) => {
    const achievementElement = document.createElement('div');
    achievementElement.className = 'timeline-item';
    
    const formattedDate = new Date(achievement.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    achievementElement.innerHTML = `
      <div class="timeline-content">
        <div class="timeline-date">${formattedDate}</div>
        <h4 class="timeline-title">${achievement.title}</h4>
        <p class="timeline-desc">${achievement.description}</p>
      </div>
    `;
    
    timeline.appendChild(achievementElement);
  });
}

// Admin functions
function setupAdmin() {
  document.getElementById('achievementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newAchievement = {
      title: document.getElementById('achievementTitle').value,
      description: document.getElementById('achievementDesc').value,
      date: document.getElementById('achievementDate').value
    };
    
    // Add to local array
    achievements.push(newAchievement);
    displayAchievements();
    
    // In a real app, you would save to a database or GitHub
    // For now we'll just update the UI
    alert('Achievement added to view! To make permanent, update achievements.json file.');
    
    // Reset form
    e.target.reset();
  });
  
  // Simple admin login (replace with real auth later)
  const adminKey = 'bhanu123'; // Change this to your secret key
  const enteredKey = prompt('Enter admin key to edit achievements:');
  if (enteredKey === adminKey) {
    localStorage.setItem('portfolioAdmin', 'true');
    document.getElementById('adminActions').style.display = 'block';
  }
}

// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', () => {
  loadMediumPosts();
  loadAchievements();
  setupAdmin();
});
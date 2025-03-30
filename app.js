// app.js

// Runs after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Parse the data from global variables
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
  
    const saveButton = document.querySelector('#btnSave');
    const deleteButton = document.querySelector('#btnDelete');
  
    // Generate initial user list
    generateUserList(userData, stocksData);
  
    // Register Save button event
    saveButton.addEventListener('click', (e) => {
      e.preventDefault();
      const id = document.querySelector('#userID').value;
  
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].id == id) {
          userData[i].user.firstname = document.querySelector('#firstname').value;
          userData[i].user.lastname = document.querySelector('#lastname').value;
          userData[i].user.address = document.querySelector('#address').value;
          userData[i].user.city = document.querySelector('#city').value;
          userData[i].user.email = document.querySelector('#email').value;
  
          generateUserList(userData, stocksData);
          break;
        }
      }
    });
  
    // Register Delete button event
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      const userId = document.querySelector('#userID').value;
      const userIndex = userData.findIndex(user => user.id == userId);
      if (userIndex !== -1) {
        userData.splice(userIndex, 1);
        generateUserList(userData, stocksData);
        document.querySelector('.portfolio-list').innerHTML = '';
        document.querySelector('.userEntry').reset();
        document.querySelector('.stock-form').reset();
      }
    });
  });
  
  /**
   * Loops through users and renders a list
   */
  function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // Clear before rendering
  
    users.forEach(({ user, id }) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${user.lastname}, ${user.firstname}`;
      listItem.setAttribute('id', id);
      userList.appendChild(listItem);
    });
  
    // Attach event listener using event delegation
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
  }
  
  /**
   * Handles click on user list
   */
  function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
  
    if (user) {
      populateForm(user);
      renderPortfolio(user, stocks);
    }
  }
  
  /**
   * Populates the form with selected user data
   */
  function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }
  
  /**
   * Renders the user's portfolio
   */
  function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = ''; // Clear previous render
  
    // Header Row
    const headers = ['Symbol', '# Shares', 'Actions'];
    headers.forEach(header => {
      const h3 = document.createElement('h3');
      h3.innerText = header;
      portfolioDetails.appendChild(h3);
    });
  
    portfolio.forEach(({ symbol, owned }) => {
      const symbolEl = document.createElement('p');
      const sharesEl = document.createElement('p');
      const actionEl = document.createElement('button');
  
      symbolEl.innerText = symbol;
      sharesEl.innerText = owned;
      actionEl.innerText = 'View';
      actionEl.setAttribute('id', symbol);
  
      portfolioDetails.appendChild(symbolEl);
      portfolioDetails.appendChild(sharesEl);
      portfolioDetails.appendChild(actionEl);
    });
  
    // Handle view button clicks
    portfolioDetails.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        viewStock(event.target.id, stocks);
      }
    });
  }
  
  /**
   * Displays stock details when view is clicked
   */
  function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
  
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }
  
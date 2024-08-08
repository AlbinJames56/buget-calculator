let isSecondNextClick = false;
let isThirdNextClick= false;
let incomeData = [];
let expenseData = [];
let totalAmount = 0;
let totalExpense = 0; 
const colors = [];
let pieChartInstance = null;
let barChartInstance = null;
// getting loggged username
let username=localStorage.getItem("LOGGED_IN_USER");

function updateProgress(currentStep) {
    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.line');
    
    steps.forEach((step, index) => {
      if (index < currentStep) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
    });
    
    lines.forEach((line, index) => {
      if (index < currentStep - 1) {
        line.classList.add('completed-line');
      } else {
        line.classList.remove('completed-line');
      }
    });
  }
; 
  
function loadIncomeData(){
  let totalIncomeElement = document.getElementById('totalIncome');
  let incomeTableBody = document.getElementById('income-table-body');
  let userIncomeKey = `${username}_INCOME_DATA`; // Use a specific key for income data
 
  incomeTableBody.innerHTML = ""; // Clear the table
  totalAmount = 0;
  let userIncomeData=JSON.parse(localStorage.getItem(userIncomeKey))||[];
  let num=0;
  userIncomeData.forEach(income=>{
     
    // Update the table with the new income entry
    num++;
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
      <td>${num}</td>
      <td style="background-color:${income.color}; class="p-2"> </td>
        <td>${income.incomeSource}</td>
        <td>${income.amount}</td>
      `;
      incomeTableBody.appendChild(newRow);
      totalAmount += parseFloat(income.amount);

      
  })
  totalIncomeElement.innerHTML = totalAmount.toFixed(2);
  updateBalance();
}
// Function to load and display expense data from local storage
function loadExpenseData() {
  let totalExpenseElement = document.getElementById('totalExpense');
  let expenseTableBody = document.getElementById('expense-table-body');
  let userExpenseKey = `${username}_EXPENSE_DATA`;
  let userExpenseData = JSON.parse(localStorage.getItem(userExpenseKey)) || [];


  expenseTableBody.innerHTML = ""; // Clear the table
  totalExpense = 0;
  let num=0;
  userExpenseData.forEach(expense => {
    num++
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
      <td>${num}</td>
          <td style="background-color:${expense.color};" class="p-2"></td>
          <td>${expense.expenseSource}</td>
          <td>${expense.amount}</td>
      `;
      expenseTableBody.appendChild(newRow);
      totalExpense += parseFloat(expense.amount);
  });

  totalExpenseElement.innerHTML = totalExpense.toFixed(2);
  updateBalance();
}
// Call loadIncomeData() when the page loads to display any saved income data
window.onload = function() {
  loadIncomeData();
  loadExpenseData();
};

function addIncome() {
  let incomeSource = document.getElementById('source-input').value;
 let amountStr = document.getElementById('amount-input').value; 
 
  
  if (incomeSource !== "" && amountStr !== "") {
    updateProgress(1)
    const amount = parseFloat(amountStr);
    if (!isNaN(amount)) { 
      const color = getRandomColor();
       
      // retrieve existing income data from local storage dor the logged in user
      let userIncomeKey = `${username}_INCOME_DATA`; // Use a specific key for income data
      let userIncomeData = JSON.parse(localStorage.getItem(userIncomeKey)) || [];
      // adding income to user local storage
      let income={
        "incomeSource":incomeSource,
        "amount":amount.toFixed(2),
        "color":color
      }
      userIncomeData.push(income);
    // store updated income data back in the local storage
      localStorage.setItem(userIncomeKey,JSON.stringify(userIncomeData))

      // Update the table with the new income entry
      loadIncomeData();
      
   
    } else {
      alert("Please enter a valid number for the amount.");
    }
  } else {
    alert("Please fill in both the income source and amount.");
  }
}

function addExpense() {
  updateProgress(2)
    let expenseSource = document.getElementById('source-input').value;
    let amountStr = document.getElementById('amount-input').value;
    
       
    if (expenseSource !== "" && amountStr !== "") {
      const amount = parseFloat(amountStr);
      if (!isNaN(amount)) {
         
        // Generate a random color
        const color = getRandomColor(); 
        
        // retrieve existing income data from local storage dor the logged in user
        let userExpenseKey = `${username}_EXPENSE_DATA`;
        let userExpenseData = JSON.parse(localStorage.getItem(userExpenseKey)) || [];
      // adding income to user local storage
      let expense={
        "expenseSource":expenseSource,
        "amount":amount.toFixed(2),
        "color":color
      } 
    userExpenseData.push(expense);
    localStorage.setItem(userExpenseKey, JSON.stringify(userExpenseData));

    // Reload the expense data to update the table
    loadExpenseData();
      } else {
        alert("Please enter a valid number for the amount.");
      }
    } else {
      alert("Please fill in both the expense source and amount.");
    }
  }
  // updating balance
  function updateBalance() {
    let balanceElement = document.getElementById('balance');
    let balance = totalAmount - totalExpense;
    balanceElement.innerHTML = balance.toFixed(2);
}
  function goNext() {
    if (isSecondNextClick) {
        if (totalExpense > 0) {
            document.getElementById('calculate-btn').remove();
            updateProgress(3);
            document.getElementById('nextBtn').innerText = 'Create Bar Chart';
            createPieChart();

            isThirdNextClick = true;
            isSecondNextClick = false; 
        } else {
            alert('Please add some expenses first');
        }
    } else if (isThirdNextClick) {
        updateProgress(4);
        createBarChart(totalAmount, totalExpense);
        document.getElementById('nextBtn').innerText = 'Home';
        document.getElementById('nextBtn').setAttribute('onclick', 'window.location.href="./home.html"');
    } else {
        if (totalAmount > 0) {
            document.getElementById('nextBtn').innerText = 'Create Pie Chart';
            document.getElementById('monthly-head').innerHTML = '<h2>Monthly Expense</h2>';
            document.getElementById('monthly-source-label').innerHTML = 'Expenses';
            document.getElementById('calculate-btn').setAttribute('onclick', 'addExpense()'); 
            
            isSecondNextClick = true;
        } else {
            alert('Please add some income first');
        }
    }
}


//   color generations
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
 
   
//   pie chart
function createPieChart() {
  const ctxPie = document.getElementById('incomeExpenseChart').getContext('2d'); 
  pieChartName.innerHTML="Pie Chart"
  // Retrieve income and expense data from local storage
  let userIncomeKey = `${username}_INCOME_DATA`;
  let userExpenseKey = `${username}_EXPENSE_DATA`;
  let userIncomeData = JSON.parse(localStorage.getItem(userIncomeKey)) || [];
  let userExpenseData = JSON.parse(localStorage.getItem(userExpenseKey)) || [];
  
  // Combine income and expense data
  const combinedData = [
      ...userIncomeData.map(data => ({ source: data.incomeSource, amount: parseFloat(data.amount), color: data.color })),
      ...userExpenseData.map(data => ({ source: data.expenseSource, amount: parseFloat(data.amount), color: data.color }))
  ];

  // Destroy existing chart instance if it exists
  if (pieChartInstance) {
      pieChartInstance.destroy();
  }

  // Create the pie chart
  pieChartInstance = new Chart(ctxPie, {
      type: 'pie',
      data: {
          labels: combinedData.map(data => data.source),
          datasets: [{
              data: combinedData.map(data => data.amount),
              backgroundColor: combinedData.map(data => data.color)
          }]
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'top',
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          return tooltipItem.label + ': $' + tooltipItem.raw.toFixed(2);
                      }
                  }
              }
          }
      }
  });
}


function createBarChart(totalIncome, totalExpenses) {
  const ctxBar = document.getElementById('barChart').getContext('2d');
  barChartName.innerHTML="Bar Chart"
  // Destroy existing chart instance if it exists
  if (barChartInstance) {
      barChartInstance.destroy();
  }

  barChartInstance = new Chart(ctxBar, {
      type: 'bar',
      data: {
          labels: ['Total Income', 'Total Expenses'],
          datasets: [{
              label: 'Amount',
              data: [totalIncome, totalExpenses],
              backgroundColor: ['#4CAF50', '#F44336'],
              borderColor: ['#388E3C', '#D32F2F'],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
} 

function deleteAllUserData() {
  let userIncomeKey = `${username}_INCOME_DATA`; // Key for income data
  let userExpenseKey = `${username}_EXPENSE_DATA`; // Key for expense data
  
  // Remove income and expense data from local storage
  localStorage.removeItem(userIncomeKey);
  localStorage.removeItem(userExpenseKey);
  
  // Clear the total amounts
  totalAmount = 0;
  totalExpense = 0;
  
  // Update the UI to reflect the deletion
  document.getElementById('income-table-body').innerHTML = ""; // Clear income table
  document.getElementById('expense-table-body').innerHTML = ""; // Clear expense table
  document.getElementById('totalIncome').innerHTML = "0.00"; // Reset total income display
  document.getElementById('totalExpense').innerHTML = "0.00"; // Reset total expense display
  document.getElementById('balance').innerHTML = "0.00"; // Reset balance display

  // Optionally, destroy the pie chart if it exists
  if (pieChartInstance) {
      pieChartInstance.destroy();
  }
  if(barChartInstance){
    barChartInstance.destroy()
  }
}

let isSecondNextClick = false;
let isThirdNextClick= false;
let incomeData = [];
let expenseData = [];
let totalAmount = 0;
let totalExpense = 0; 
const colors = [];
let pieChartInstance = null;
let barChartInstance = null;

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
  


function addIncome() {
  let incomeSource = document.getElementById('source-input').value;
 let amountStr = document.getElementById('amount-input').value; 
 let incomeTableBody = document.getElementById('income-table-body');
 let totalIncomeElement = document.getElementById('totalIncome');
  
  if (incomeSource !== "" && amountStr !== "") {
    updateProgress(1)
    const amount = parseFloat(amountStr);
    if (!isNaN(amount)) {
      totalAmount += amount;
      const color = getRandomColor();
      colors.push(color);
      incomeData.push({ source: incomeSource, amount, color });

      // Update the table with the new income entry
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
      <td style="background-color:${color}; class="p-2"> </td>
        <td>${incomeSource}</td>
        <td>${amount.toFixed(2)}</td>
      `;
      incomeTableBody.appendChild(newRow);
      
      // Update the total income display
      totalIncomeElement.innerHTML = totalAmount.toFixed(2);
   
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
    let expenseTableBody = document.getElementById('expense-table-body'); 
    const totalExpenseElement = document.getElementById('totalExpense');  
  
    if (expenseSource !== "" && amountStr !== "") {
      const amount = parseFloat(amountStr);
      if (!isNaN(amount)) {
        totalExpense += amount;
  
        // Generate a random color
        const color = getRandomColor();
        colors.push(color);
        expenseData.push({ source: expenseSource, amount, color });
  
        // Update the table with the new expense entry
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td  style="background-color:${color}; "> </td>
          <td  ">${expenseSource}</td>
          <td  ">${amount.toFixed(2)}</td>
        `;
        expenseTableBody.appendChild(newRow);
         // Clear the input fields
 
        // Update the total expense display
        totalExpenseElement.innerHTML = totalExpense.toFixed(2);
      } else {
        alert("Please enter a valid number for the amount.");
      }
    } else {
      alert("Please fill in both the expense source and amount.");
    }
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

            balance.innerHTML = totalAmount - totalExpense;
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
            balance.innerHTML = totalAmount - totalExpense;
            isSecondNextClick = true;
        } else {
            alert('Please add some expenses first');
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

  // Destroy existing chart instance if it exists
  if (pieChartInstance) {
      pieChartInstance.destroy();
  }

  // Combine income and expense data
  const combinedData = [...incomeData, ...expenseData];

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
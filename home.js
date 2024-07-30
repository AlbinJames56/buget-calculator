let isSecondNextClick = false;
let incomeData = [];
let expenseData = [];

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
  
let totalAmount = 0;
const colors = [];

function addIncome() {
  let incomeSource = document.getElementById('source-input').value;
 let amountStr = document.getElementById('amount-input').value; 
 let incomeTableBody = document.getElementById('income-table-body');
 let totalIncomeElement = document.getElementById('totalIncome');
  
  if (incomeSource !== "" && amountStr !== "") {
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

function goNext(){
    if(isSecondNextClick){
      document.getElementById('calculate-btn').setAttribute('onclick', ' ');
        updateProgress(2)
        createPieChart();
    }
    else{
        updateProgress(1)
        document.getElementById('nextBtn').innerText='Create pie Chart'
        document.getElementById('monthly-head').innerHTML='<h2>Monthly Expense</h2>'
        document.getElementById('monthly-source-label').innerHTML='Expenses'
        // Change the button's onclick function
    document.getElementById('calculate-btn').setAttribute('onclick', 'addExpense()');
    isSecondNextClick = true;
    }
    
    
}
let totalExpense = 0;
function addExpense() {
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
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
  
    // Combine income and expense data
    const combinedData = [...incomeData, ...expenseData];
  
    new Chart(ctx, {
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
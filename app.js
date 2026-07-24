// =========================
// RevPulse Dashboard
// Application Logic
// =========================



// Load Revenue Data

fetch("data/revenue.json")

.then(response => response.json())

.then(data => {


    loadKPIs(data.kpis);

    createPipelineChart(data.pipeline);

    createRevenueChart(data.revenueGrowth);

    createSalesChart(data.salesTeam);

    createCustomerChart(data.customers);

    loadOpportunityTable(data.opportunities);


})

.catch(error => {

    console.error(
        "Error loading revenue data:",
        error
    );

});





// =========================
// KPI CARDS
// =========================


function loadKPIs(kpis){


    document.getElementById("arr").textContent =
        formatCurrency(kpis.arr);



    document.getElementById("pipeline").textContent =
        formatCurrency(kpis.pipeline);



    document.getElementById("winRate").textContent =
        kpis.winRate + "%";



    document.getElementById("churn").textContent =
        kpis.churn + "%";


}






// =========================
// PIPELINE CHART
// =========================


function createPipelineChart(data){


    const labels = data.map(
        item => item.stage
    );


    const values = data.map(
        item => item.value
    );



    new Chart(
        document.getElementById("pipelineChart"),
        {

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Pipeline Value",

                data:values

            }]

        },


        options:{

            responsive:true

        }


    });


}






// =========================
// REVENUE GROWTH CHART
// =========================


function createRevenueChart(data){


    const labels = data.map(
        item => item.month
    );


    const values = data.map(
        item => item.revenue
    );



    new Chart(
        document.getElementById("revenueChart"),
        {

        type:"line",

        data:{

            labels:labels,


            datasets:[{

                label:"Monthly Revenue",

                data:values,

                tension:0.3

            }]

        },


        options:{

            responsive:true

        }


    });


}







// =========================
// SALES PERFORMANCE CHART
// =========================


function createSalesChart(data){


    const labels = data.map(
        item => item.name
    );


    const values = data.map(
        item => item.revenue
    );



    new Chart(
        document.getElementById("salesChart"),
        {


        type:"bar",


        data:{


            labels:labels,


            datasets:[{

                label:"Revenue Generated",

                data:values

            }]


        },


        options:{


            responsive:true


        }


    });



}







// =========================
// CUSTOMER LIFECYCLE CHART
// =========================


function createCustomerChart(data){


    const labels = data.map(
        item => item.status
    );


    const values = data.map(
        item => item.count
    );



    new Chart(

        document.getElementById("customerChart"),

        {


        type:"doughnut",


        data:{


            labels:labels,


            datasets:[{

                label:"Customers",

                data:values

            }]


        },


        options:{


            responsive:true


        }



    });



}







// =========================
// OPPORTUNITY TABLE
// =========================


let opportunities = [];



function loadOpportunityTable(data){


    opportunities = data;


    renderTable(opportunities);


}




function renderTable(data){


    const table =
    document.getElementById(
        "opportunityTable"
    );


    table.innerHTML = "";



    data.forEach(opportunity => {


        const row =
        document.createElement("tr");



        row.innerHTML = `


        <td>
        ${opportunity.company}
        </td>


        <td>
        ${opportunity.stage}
        </td>


        <td>
        ${formatCurrency(opportunity.value)}
        </td>


        <td>
        ${opportunity.owner}
        </td>


        <td>
        ${opportunity.probability}%
        </td>


        `;



        table.appendChild(row);


    });


}







// =========================
// CURRENCY FORMATTER
// =========================


function formatCurrency(value){


    return new Intl.NumberFormat(
        "en-GB",
        {

        style:"currency",

        currency:"GBP",

        maximumFractionDigits:0

        }

    ).format(value);



}

// =========================
// SEARCH + FILTER
// =========================


document
.getElementById("searchInput")
.addEventListener(
"input",
filterTable
);



document
.getElementById("stageFilter")
.addEventListener(
"change",
filterTable
);



function filterTable(){


const search =
document.getElementById(
"searchInput"
).value
.toLowerCase();



const stage =
document.getElementById(
"stageFilter"
).value;



const filtered =
opportunities.filter(item => {


const matchesSearch =
item.company
.toLowerCase()
.includes(search);



const matchesStage =
stage === "all"
||
item.stage === stage;



return matchesSearch && matchesStage;


});



renderTable(filtered);


}

// =========================
// CSV EXPORT
// =========================


document
.getElementById("exportBtn")
.addEventListener(
"click",
exportCSV
);



function exportCSV(){


let csv =
"Company,Stage,Value,Owner,Probability\n";



opportunities.forEach(item=>{


csv +=
`${item.company},${item.stage},${item.value},${item.owner},${item.probability}%\n`;


});



const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);



const url =
URL.createObjectURL(blob);



const link =
document.createElement("a");


link.href=url;


link.download=
"revpulse-opportunities.csv";


link.click();


}
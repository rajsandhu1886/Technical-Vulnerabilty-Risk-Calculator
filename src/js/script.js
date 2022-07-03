var riskChart = document.getElementById("riskChart").getContext("2d")
var statusCode = document.getElementById("status")

const threats = [
    "Ease of Discovery",
    "Ease of Exploit",
    "Awareness",
    "Ability to Detect",
    "Loss of Confidentiality",
    "Loss of Integrity",
    "Loss of Availability",
    "Loss of Traceabilty",
]

const riskChartOptions = {
    legend: {
        position: "top",
        display: false,
    },
    title: {
        display: false,
        text: "Chart.js Radar Chart",
    },
    scale: {
        ticks: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 5,
            stepSize: 1,
        },
    },
}

// CHARTJS
riskChart = new Chart(riskChart, {
    type: "radar",
    data: {
        labels: threats,
        datasets: [{
            data: [],
            pointBackgroundColor: "",
            backgroundColor: "",
            borderColor: "",
            borderWidth: 2,
        }, ],
    },
    options: riskChartOptions,
})

function updateRiskChart(dataset) {
    if (
        t_loc.value === "00" ||
        t_loi.value === "00" ||
        t_loa.value === "00" ||
        t_loac.value === "00" ||
        v_eod.value === "00" ||
        v_eoe.value === "00" ||
        v_a.value === "00" ||
        v_id.value === "00"
    ) {
        return
    }

    var tech =
        (parseFloat(t_loc.value) +
            parseFloat(t_loi.value) +
            parseFloat(t_loa.value) +
            parseFloat(t_loac.value)) /
        4
    var vuln =
        (parseFloat(v_eod.value) +
            parseFloat(v_eoe.value) +
            parseFloat(v_a.value) +
            parseFloat(v_id.value)) /
        4

    var c = closer(tech) * closer(vuln)

    var row = "imp-" + closer(tech)

    var col = "prob-" + closer(vuln)

    var tots = row + "-" + col
    console.log("tots: ", tots)

    var final
    if (
        tots === "imp-1-prob-1" ||
        tots === "imp-2-prob-1" ||
        tots === "imp-3-prob-1" ||
        tots === "imp-1-prob-2" ||
        tots === "imp-2-prob-2" ||
        tots === "imp-1-prob-3" ||
        tots === "imp-1-prob-4" ||
        tots === "imp-1-prob-5"
    ) {
        final = "scale-1"
    } else if (
        tots === "imp-4-prob-1" ||
        tots === "imp-3-prob-2" ||
        tots === "imp-3-prob-3" ||
        tots === "imp-4-prob-2" ||
        tots === "imp-2-prob-3" ||
        tots === "imp-2-prob-4"
    ) {
        final = "scale-2"
    } else if (
        tots === "imp-5-prob-1" ||
        tots === "imp-5-prob-2" ||
        tots === "imp-4-prob-3" ||
        tots === "imp-3-prob-4" ||
        tots === "imp-2-prob-5"
    ) {
        final = "scale-3"
    } else if (
        tots === "imp-5-prob-3" ||
        tots === "imp-4-prob-4" ||
        tots === "imp-5-prob-4" ||
        tots === "imp-3-prob-5" ||
        tots === "imp-4-prob-5" ||
        tots === "imp-5-prob-5"
    ) {
        final = "scale-4"
    }
    console.log("final: ", final)

    if (closer(tech) === 0 || closer(vuln) === 0) {} else {
        setGrid("vals", tots)
        setGrid("crits", final)
    }

    let color

    if (c === 0) {
        color = ["rgba(253, 224, 71, 0.5)", "rgba(253, 224, 71, 1)"]
        statusCode.innerHTML = "Total Risk: None"
        setClass(statusCode, "bg-slate-100")
    } else if (
        tots === "imp-1-prob-1" ||
        tots === "imp-2-prob-1" ||
        tots === "imp-3-prob-1" ||
        tots === "imp-1-prob-2" ||
        tots === "imp-2-prob-2" ||
        tots === "imp-1-prob-3" ||
        tots === "imp-1-prob-4" ||
        tots === "imp-1-prob-5"
    ) {
        color = ["rgba(253, 224, 71, 0.5)", "rgba(253, 224, 71, 1)"]
        statusCode.innerHTML = "Total Risk: Low"
        setClass(statusCode, "bg-yellow-300")
    } else if (
        tots === "imp-4-prob-1" ||
        tots === "imp-3-prob-2" ||
        tots === "imp-3-prob-3" ||
        tots === "imp-4-prob-2" ||
        tots === "imp-2-prob-3" ||
        tots === "imp-2-prob-4"
    ) {
        color = ["rgba(251, 146, 60, 0.5)", "rgba(251, 146, 60, 1)"]
        statusCode.innerHTML = "Total Risk: Moderate"
        setClass(statusCode, "bg-orange-400")
    } else if (
        tots === "imp-5-prob-1" ||
        tots === "imp-5-prob-2" ||
        tots === "imp-4-prob-3" ||
        tots === "imp-3-prob-4" ||
        tots === "imp-2-prob-5"
    ) {
        color = ["rgba(154, 52, 18, 0.5)", "rgba(154, 52, 18, 1)"]
        statusCode.innerHTML = "Total Risk: Significant"
        setClass(statusCode, "bg-orange-800")
    } else if (
        tots === "imp-5-prob-3" ||
        tots === "imp-4-prob-4" ||
        tots === "imp-5-prob-4" ||
        tots === "imp-3-prob-5" ||
        tots === "imp-4-prob-5" ||
        tots === "imp-5-prob-5"
    ) {
        color = ["rgba(220, 38, 37, 0.5)", "rgba(220, 38, 37, 1)"]
        statusCode.innerHTML = "Total Risk: Severe"
        setClass(statusCode, "bg-red-600")
    }
    var totalrisk = document.getElementById("totalrisk")
    if (c > 0) {
        totalrisk.innerHTML = "= " + c.toFixed(2)
    }

    var dataset = dataset
    riskChart.data.labels = threats
    riskChart.data.datasets[0].data = dataset
    riskChart.data.datasets[0].spanGaps = dataset
    riskChart.data.datasets[0].pointBackgroundColor = color[1]
    riskChart.data.datasets[0].backgroundColor = color[0]
    riskChart.data.datasets[0].borderColor = color[1]

    riskChart.update()
}

function calculate() {
    var dataset = []

    // Get values VULNERABILITY FACTORS
    dataset.push(v_eod.value)
    dataset.push(v_eoe.value)
    dataset.push(v_a.value)
    dataset.push(v_id.value)

    // Get values TECHNICAL IMPACT FACTORS
    dataset.push(t_loc.value)
    dataset.push(t_loi.value)
    dataset.push(t_loa.value)
    dataset.push(t_loac.value)

    //FINAL
    updateRiskChart(dataset)
}
// CHARTCHART

// 0.1 – 3.9 = Low
// 4.0 – 6.9 = Moderate
// 7.0 – 8.9 = Significant
// 9.0 – 10.0 = Severe

// TECHNICAL IMPACT
var t_loc = document.getElementById("t-loc")
var t_loi = document.getElementById("t-loi")
var t_loa = document.getElementById("t-loa")
var t_loac = document.getElementById("t-lot")
var impact = document.getElementById("impact")

var t_loc_result = document.getElementById("t-loc_result")
var t_loi_result = document.getElementById("t-loi_result")
var t_loa_result = document.getElementById("t-loa_result")
var t_loac_result = document.getElementById("t-lot_result")
    // var impact_result = document.getElementById("impact_result")

function techCalc() {
    if (
        t_loc.value === "00" ||
        t_loi.value === "00" ||
        t_loa.value === "00" ||
        t_loac.value === "00"
    ) {
        return
    }
    var score =
        (parseFloat(t_loc.value) +
            parseFloat(t_loi.value) +
            parseFloat(t_loa.value) +
            parseFloat(t_loac.value)) /
        4
    let adj
    adj = "none"
    var totalimp = document.getElementById("totalimp")
    if (score > 0) {
        totalimp.innerHTML = "= " + score.toFixed(2)
    }

    score = closer(score)
    if (score === 0) {
        adj = "none"
        setClass(impact, "bg-slate-100")
    } else if (score >= 1 && score < 2) {
        adj = "Very Low"
        setClass(impact, "bg-yellow-300")
    } else if (score >= 2 && score < 3) {
        adj = "Low"
        setClass(impact, "bg-yellow-300")
    } else if (score >= 3 && score < 4) {
        adj = "Medium"
        setClass(impact, "bg-orange-400")
    } else if (score >= 4 && score < 5) {
        adj = "High"
        setClass(impact, "bg-orange-800")
    } else if (score === 5) {
        adj = "Very High"
        setClass(impact, "bg-red-600")
    }

    impact.innerHTML = score + " " + adj
    setGrid("imp", closer(score))
    var totalimp_rounded = document.getElementById("totalimp_rounded")
    if (score > 0) {
        totalimp_rounded.innerHTML = "(" + score.toFixed(2) + ")"
    }

    // impact_result.innerHTML = "(" + score + ")"

    t_loc_result.innerHTML = " (" + t_loc.value + ")"
    t_loi_result.innerHTML = " (" + t_loi.value + ")"
    t_loa_result.innerHTML = " (" + t_loa.value + ")"
    t_loac_result.innerHTML = " (" + t_loac.value + ")"
    calculate()
}
// TECHNICAL IMPACT

// VULNERABILITY FACTORS
var v_eod = document.getElementById("v-eod")
var v_eoe = document.getElementById("v-eoe")
var v_a = document.getElementById("v-a")
var v_id = document.getElementById("v-atd")
var vulnerability = document.getElementById("vulnerability")

var v_eod_result = document.getElementById("v-eod_result")
var v_eoe_result = document.getElementById("v-eoe_result")
var v_a_result = document.getElementById("v-a_result")
var v_id_result = document.getElementById("v-atd_result")
    // var probability_result = document.getElementById("probability_result")

function vulnerabilityCalc() {
    if (
        v_eod.value === "00" ||
        v_eoe.value === "00" ||
        v_a.value === "00" ||
        v_id.value === "00"
    ) {
        return
    }

    var score =
        (parseFloat(v_eod.value) +
            parseFloat(v_eoe.value) +
            parseFloat(v_a.value) +
            parseFloat(v_id.value)) /
        4
    var totalprob = document.getElementById("totalprob")
    if (score > 0) {
        totalprob.innerHTML = "= " + score.toFixed(2)
    }
    score = closer(score)
    let adj
    adj = "none"
    if (score === 0) {
        adj = "none"
        setClass(vulnerability, "bg-slate-100")
    } else if (score >= 1 && score < 2) {
        adj = "Very Low"
        setClass(vulnerability, "bg-yellow-300")
    } else if (score >= 2 && score < 3) {
        adj = "Low"
        setClass(vulnerability, "bg-yellow-300")
    } else if (score >= 3 && score < 4) {
        adj = "Medium"
        setClass(vulnerability, "bg-orange-400")
    } else if (score >= 4 && score < 5) {
        adj = "High"
        setClass(vulnerability, "bg-orange-800")
    } else if (score === 5) {
        adj = "Very High"
        setClass(vulnerability, "bg-red-600")
    }

    setGrid("prob", closer(score))
    var totalprob_rounded = document.getElementById("totalprob_rounded")
    if (score > 0) {
        totalprob_rounded.innerHTML = "(" + score.toFixed(2) + ")"
    }

    vulnerability.innerHTML = score + " " + adj
        // probability_result.innerHTML = "(" + score + ")"
    v_eod_result.innerHTML = " (" + v_eod.value + ")"
    v_eoe_result.innerHTML = " (" + v_eoe.value + ")"
    v_a_result.innerHTML = " (" + v_a.value + ")"
    v_id_result.innerHTML = " (" + v_id.value + ")"
    calculate()
}
// VULNERABILITY FACTORS

function setClass(ctx, className) {
    ctx.classList.remove("bg-yellow-300")
    ctx.classList.remove("bg-yellow-300")
    ctx.classList.remove("bg-orange-400")
    ctx.classList.remove("bg-orange-800")
    ctx.classList.remove("bg-red-600")
    ctx.classList.add(className)
}

function setGrid(cls, ctx) {
    if (ctx === 0) {
        return
    }
    let doc = document.getElementsByClassName(cls)

    for (var i = 0; i < doc.length; i++) {
        doc[i].classList.remove("selected")
    }

    let grid = document.querySelectorAll(`[data-${cls}`)

    for (var i = 0; i < grid.length; i++) {
        grid[i].classList.remove("selected")
        grid[i].classList.add("opacity-50")
        grid[i].classList.remove("opacity-100")
    }

    for (
        var i = 0; i < document.querySelectorAll(`[data-${cls}='${ctx}']`).length; i++
    ) {
        document
            .querySelectorAll(`[data-${cls}='${ctx}']`)[i].classList.remove("opacity-50")
        document
            .querySelectorAll(`[data-${cls}='${ctx}']`)[i].classList.add("selected")
    }
}

function totalCalc() {}

// toggle Explainer
var modal = document.getElementById("explainer")

function toggleExplainer() {
    modal.classList.toggle("opacity-0")
    modal.classList.toggle("pointer-events-none")
}

// Run first
// vulnerabilityCalc()
// techCalc()

var allOptions = document.querySelectorAll("select")
var currentParams = {}
var url = window.location.href + "?"
var url_1 = window.location.href.split("?")[0] + "?"
var url_2

if (url.split("?").length >= 3) {
    url_2 = url.split("?")[1]

    url_2 = url_2.replaceAll("%7D", "}")
    url_2 = url_2.replaceAll("%7d", "}")

    url_2 = url_2.replaceAll("%7B", "{")
    url_2 = url_2.replaceAll("%7b", "{")

    url_2 = url_2.replaceAll("%22", '"')

    url_2 = JSON.parse(url_2)
    currentParams = {...currentParams, ...url_2 }
}

allOptions.forEach(function(option) {
    option.addEventListener("change", function() {
        currentParams[option.id] = option.value
        history.replaceState(
            "none",
            "unused",
            url_1 + JSON.stringify(currentParams)
        )
        document.getElementById("vector").innerHTML =
            "<span class='cursor-pointer text-blue-500 underline uppercase text-sm'>" +
            JSON.stringify(currentParams).replaceAll("v-", "").replaceAll("t-", "") +
            "</span>"
    })
})

window.addEventListener("load", function() {
    if (url.split("?").length <= 2) return
    Object.keys(currentParams).forEach((key) => {
        var sel = document.getElementById(key)
        sel.value = currentParams[key]
    })
    vulnerabilityCalc()
    techCalc()
    totalCalc()
        // document.getElementById("vector").innerHTML =
        // 	"<span class='font-bold'>Vector: </span> <span class='cursor-pointer text-blue-500 underline uppercase text-sm'>" +
        // 	JSON.stringify(currentParams).replaceAll("v-", "").replaceAll("t-", "") +
        // 	"</span>"
    document.getElementById("vector").innerHTML =
        "<a href='' id='vector_link' class='cursor-pointer text-blue-500 underline uppercase text-sm'>" +
        JSON.stringify(currentParams).replaceAll("v-", "").replaceAll("t-", "") +
        "</a>"

    // document.getElementById("vector_link").attr("href", window.location.href)
})

function copy() {
    var type = "text/plain"
    var blob = new Blob([window.location.href], { type })
    var data = [
        new ClipboardItem({
            [type]: blob,
        }),
    ]
    navigator.clipboard.write(data)
}

function closer(num) {
    if (num < 0.5) {
        return Math.ceil(num)
    } else {
        return Math.round(num)
    }
}
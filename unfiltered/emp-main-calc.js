// this is use for employee cost calculator 

import {
    // checkDisabledBtn,
    createList,
    createListCurrency,
    createSalaryTemplate,
    filterList,
    updateMeta,
    commaSeprateVal
} from "https://cdn.jsdelivr.net/gh/thvishal/sk/employee-calculator-helper.js"
// old helper -> https://dl.dropboxusercontent.com/scl/fi/ls6hryquf3ymagqb73lc5/new-updated-main-helper.js?rlkey=cdnhfh3wdljjzpmft1bl7sowv&dl=0

let currencyList = [
    { label: "USD", value: "USD" },
    { label: "GBP", value: "GBP" },
    { label: "EUR", value: "EUR" },
];

const url = "https://cost-calculator.skuad.io/cost-calculator/active-country-list?enabled=true";

const fetchCountryData = async (url) => {
    let response = await fetch(url);
    const newVar = await response.json();
    const filteredArray = newVar.data.filter((filteredItem) => filteredItem.label && filteredItem.enabled)
    return filteredArray
};

const countryList = await fetchCountryData(url);
// console.log(countryList, 'llist')

const countryListWithCurrency = countryList

createList(currencyList, "currency-list");
createListCurrency(currencyList, "currency-input");
// console.info(currencyList, 'currencyList')
// const baseUrl = 'https://cost-calculator.skuad.io/cost-calculator/cost';
const baseUrl = 'https://cost-calculator.skuad.io/cost-calculator/cost';

// const endpoint = baseUrl + "?countryCode=:countryCode&currencyCode=:currencyCode&salary=:salary&client=website"

const countryDownArrow = document.getElementById('show-calc-country')
const form = document.getElementById("calc-form-new");
const countryInput = document.getElementById("country-input-new");
const currencyInput = document.getElementById("currency-input");
const currencyListEl = document.getElementById("currency-list");
const countryListEl = document.getElementById("country-list");
const grossSalaryInput = document.getElementById("calc-amount-input");
const downloadPDFElement = document.getElementById('resp-download-pdf')
const getCountryForError = document.querySelector('.error-msg-heading')
const provinceInput = document.getElementById('state-input')
const provinceListEle = document.getElementById('province-list')
// const submitBtn = document.getElementById("calculate-salary")
const isExpatYes = document.getElementById('yes-2')
isExpatYes.setAttribute("checked", "true")
const gaID = document.getElementById('ga_id')
gaID.setAttribute("name", "ga_id")



// open demo form popup
const downloadpdfbtn = document.getElementById("resp-download-pdf")

downloadpdfbtn.addEventListener("click", (e) => {
    const isFormSubmitted = JSON.parse(localStorage.getItem("pdfFormSubmitted") || false)
    if (isFormSubmitted) {
        downloadPDF()
        return
    }
    localStorage.setItem("isPDF", true)
    showExitPopup()

})

const currencyCurSelect = (text, isOnLoad) => {
    const selectedCountry = countryListWithCurrency.find((country) => country.label === text)

    if (!selectedCountry) return;

    const filterdCurrencyList = currencyList.filter((currency, index) => currency.value !== selectedCountry.currValue && index < 3)

    const findedCountryCodeObj = currencyList.find((currItem) => currItem.value === selectedCountry.currValue)
    if (findedCountryCodeObj && !isOnLoad) {
        currencyList = currencyList.slice(0, 3)
        createListCurrency(currencyList, 'currency-input');
        return
    }
    currencyList = filterdCurrencyList
    currencyList.push({ label: selectedCountry.currValue, value: selectedCountry.currValue })
    createListCurrency(currencyList, 'currency-input');
}

fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=c23115da6cf642e59b96f32b9d512a4c", {
    crossDomain: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
})
    .then(response => response.json())
    .then(result => {

        countryInput.value = '';
        currencyList.push({ label: '', value: '' });
        //currencyCurSelect('')
        // currencyCurSelect(result.country.name, true)
    }
    )
    .catch().finally(() => {

        countryInput.removeAttribute('disabled')
        countryInput.setAttribute('placeholder', "Country")
    });

const toggleMonthYear = document.getElementById('switchMonthly');
// toggleMonthYear.setAttribute("checked", true)
const yearlyRadio = document.getElementById("switchYearly");

// const toggleClass = (key) => {
//     const activeEls = document.querySelectorAll(".active");
//     activeEls.forEach((el) => el.classList.remove("active"));
//     const el = document.getElementById(key);
//     if (el) { el.classList.add("active"); }

//     if (key === 'monthly') {
//         toggleMonthYear.checked = true
//     } else {
//         yearlyRadio.checked = true
//     }
// };
// console.info(countryList, 'clist')

let comData = null;

const salaryData = (key = "monthly") => {
    const resData = comData[key];
    // toggleClass(key);
    if (!resData) return;
    const categoryMeta = comData.categories;
    const accordians = categoryMeta.map(category => {
        // const categoryValue = resData[category.key]
        // const categoryBreakup = resData[category.key + 'Breakup'] || []

        const subCategories = category.subCategories.filter(item => item.localAmounts[`${key}Value`] && item.visibility).map(item => ({
            ...item, value: item.localAmounts[`${key}Value`]
        }))

        return ({
            ...category,
            value: category.localAmounts[`${key}Value`],
            // breakup: category.subCategories,
            subCategories: subCategories,
            categoryKey: category.key,
            currency: comData.currency,
        })
    })


    const visibleAccordian = accordians.filter(accordian => accordian.visibility && accordian.value)

    const employerData = visibleAccordian.filter(item => item.categoryKey.includes("employer") || item.categoryKey === "skuadFee" || item.categoryKey === 'skuadFeeDiscount');
    const employeeData = visibleAccordian.filter(item => item.categoryKey.includes("employee"))

    const grossSalary = visibleAccordian.find(item => item.categoryKey === "grossSalary")

    const dd = [
        {
            label: "Amount you pay",
            data: employerData,
            grossSalaryTitle: `Gross ${key === 'yearly' ? "annual" : "monthly"} pay`,
            totalEmploymentCost: comData.totalEmploymentCost.localAmounts[`${key}Value`],
            currency: comData.currency,
            grossSalary: grossSalary.localAmounts[`${key}Value`],
            durationHeading: `Total ${key === 'yearly' ? "annual" : "monthly"} cost of employment`,
        },
        {
            label: "Amount employee gets",
            data: employeeData,
            grossSalaryTitle: `Gross ${key === 'yearly' ? "annual" : "monthly"} pay`,
            totalEmploymentCost: comData.totalEmployeeSalary.localAmounts[`${key}Value`],
            currency: comData.currency,
            grossSalary: grossSalary.localAmounts[`${key}Value`],
            durationHeading: `Net ${key === 'yearly' ? "annual" : "monthly"} salary`,

        },

    ]

    createSalaryTemplate(dd);

};

function showModalHandler() {
    document.getElementById("show-calculator-modal").style.display = "block";
}

grossSalaryInput.addEventListener('keyup', (e) => {
    grossSalaryInput.value = commaSeprateVal(grossSalaryInput.value)
    // grossSalaryInput.previousElementSibling.style.display = 'none'
    // checkDisabledBtn();
})
/*
const formInputs = document.querySelectorAll(".calc-form-input")
// console.info(formInputs, 'formInputs')

function checkValidation(formInputsArg) {
    console.log(formInputsArg, "clall")
    formInputsArg.forEach(input => {
        console.log(input, "input")
        if (input.value.trim() === "") {
            console.log(input.nextElementSibling, "input nextElementSibling")
            input.nextElementSibling.style.display = 'block'
        }
        else {
            input.nextElementSibling.style.display = 'none'
        }
    })
   
}

*/
const _handleSubmit = async (e) => {
    // checkValidation(formInputs)
    e.preventDefault();

    const isCalculated = JSON.parse(localStorage.getItem("isCalculated") || "false")
    const isFormSubmitted = JSON.parse(localStorage.getItem("pdfFormSubmitted") || "false")
    localStorage.setItem("isPDF", false)
    // console.log(isCalculated, isFormSubmitted, 'kkk')
    if (isCalculated && !isFormSubmitted) {
        showExitPopup()
        return
    }
    
    const countryCd = countryList.find(
        (country) => country.label === countryInput.value
    );
    
    if (!countryCd) return;
    const currencyCd = currencyList.find(
        (curr) => curr.label === currencyInput.value
    );
    
    let objnew = {
        countryCode: countryCd.value,
        salary: grossSalaryInput.value.replaceAll(',', ''),
        currencyCode: currencyCd.value,
    }

    let isExpact = true;
    if (countryCd.isExpatApplicable) {
        isExpact = countryCd.isExpatApplicable ? document.getElementById('no').checked || false : false
    }
    else {
        isExpact = true;
    }
   
    let newUrl = baseUrl + `?client=website&countryCode=${objnew.countryCode}&currencyCode=${objnew.currencyCode}&salary=${objnew.salary}`
    // let getProvinceCode = null
    // console.log(countryCd, provinceInput.value, 'countryCd')
    const selecteProvince = document.getElementById('selected-province')
    selecteProvince.innerText = ''
    let getProvinceObj = {}
    if (countryCd.provinceList.length) {
        selecteProvince.style.display = "block"
        selecteProvince.innerText = `(${provinceInput.value})`
        const provinceArray = countryCd.provinceList
        getProvinceObj = provinceArray.find(item => item.province.trim() == provinceInput.value) || {}
        // console.log(getProvinceObj)
       
    }

    if (countryCd.isExpatApplicable && countryCd.provinceList.length) {
        newUrl = `${newUrl}&isExpat=${isExpact}&provinceCode=${getProvinceObj.provinceCode}`
        // console.info("1")
    }
    else if (countryCd.isExpatApplicable) {
        newUrl = `${newUrl}&isExpat=${isExpact}`
        // console.info("2")
    }
    else if (countryCd.provinceList.length) {
        newUrl = `${newUrl}&provinceCode=${getProvinceObj.provinceCode}`
        // console.info("3")
    }else {
        newUrl=baseUrl + `?client=website&countryCode=${objnew.countryCode}&currencyCode=${objnew.currencyCode}&salary=${objnew.salary}`
        // console.info("4")
    }


    downloadPDFElement.setAttribute('data-country', countryCd.value)
    downloadPDFElement.setAttribute('data-salary', grossSalaryInput.value.replaceAll(',', ''))
    downloadPDFElement.setAttribute('data-currency', currencyCd.value)
    if (getProvinceObj.provinceCode) {
        downloadPDFElement.setAttribute('data-province', getProvinceObj.provinceCode)
    } else {
        downloadPDFElement.removeAttribute('data-province')
    }
    downloadPDFElement.setAttribute('data-isexpat', !!isExpact)
    downloadPDFElement.setAttribute('data-country-name', countryCd.label)

    const data = await fetch(
        newUrl
    );

    data
        .json()
        .then((res) => {
            if (res.success) {
                localStorage.setItem("isCalculated", true)
                comData = res.data;
                // console.log(comData.country, 'comData')
                let findISOObj = countryList.find(item => item.label === comData.country)
                
                let countryFlagISO = findISOObj.valueISO2.toLowerCase()
                // console.log(findISOObj, countryFlagISO, 'findISOCode')
                document.getElementById("current-country-flag").setAttribute("src", `https://hatscripts.github.io/circle-flags/flags/${countryFlagISO}.svg`)
                getInitialInputDetails(comData.country, comData.currencyCode, grossSalaryInput.value || 10000, provinceInput.value || "NA", comData.isExpat)
                getCountryForError.innerText = `Want a detailed breakdown for cost of employment in ${countryCd.label}`
                downloadPDFElement.style.display = 'flex';
                // provideCountryToFormHeader(countryCd.label)
                document.getElementById("err-msg").style.display = "none";
                document.getElementById("calc-selected-country").innerHTML = `${countryCd.label}`;
                comData.currency = currencyCd.value
                document.documentElement.style.scrollBehavior = "smooth";
                salaryData();
                showModalHandler();
                document.getElementById("calc-res-wrapper").style.display = 'block';
                document.getElementById("zero-state").style.display = 'none';
                let metaDsc = [...comData.meta || [], ...comData.additionalNotes || []]
                // console.log(comData, metaDsc, 'metaDsc')
                updateMeta(metaDsc || []);
                const redirectionA = document.createElement('a');
                redirectionA.setAttribute("href", "#redirec-calculator-modal")
                redirectionA.click()

                // document.getElementById("calc-home-img").style.display = 'none'

                document.getElementById("err-msg").style.display = "none";


                document.querySelector('.e-mail-submit-wrapper').style.display = 'block';
            } else {
                document.getElementById("zero-state").style.display='none'
                document.getElementById("calc-res-wrapper").style.display = "block";
                document.getElementById("dsc-container").style.display='none';              
                document.getElementById("err-msg").style.display = "block";
                document.getElementById("show-calculator-modal").style.display = "none";
                getCountryForError.innerText = `Want a detailed breakdown for cost of employment in ${countryInput.value}`
            }
            document.getElementById("calculate-salary").removeAttribute("disabled");
            document.getElementById("calculate-salary").value = "Calculate";

            const countryValue = document.getElementById("country-input-new").value;
            document.getElementById("calc-selected-country").innerText = `${countryCd.label}`;

        })

        .catch((err) => {
            document.getElementById("calculate-salary").removeAttribute("disabled");
            document.getElementById("calculate-salary").value = "Calculate";

        });

};


form.onsubmit = _handleSubmit;

// use when a single checkbox

// toggleMonthYear.addEventListener('change', (e) => {
//     // console.info(e.target, e.target.checked, 'tt')
//     e.target.parentElement.parentElement.nextElementSibling.classList.remove('active')
//     e.target.parentElement.parentElement.previousElementSibling.classList.remove('active')
//     if (e.target.checked) {
//         // console.info(e.target.checked, 'yearly')
//         salaryData('yearly')
//         e.target.parentElement.parentElement.nextElementSibling.classList.add('active')
//     }
//     if (e.target.checked === false) {
//         salaryData('monthly')
//         // console.info(e.target.checked, 'monthly')
//         e.target.parentElement.parentElement.previousElementSibling.classList.add('active')
//     }
// })

// dual checkbox
toggleMonthYear.addEventListener('change', (e) => {
    if (e.target.checked) {
        salaryData('monthly')
    }
})

yearlyRadio.addEventListener('change', (e) => {
    if (e.target.checked) {
        salaryData('yearly')
    }
    // const selectedDuration = e.target.checked ? "yearly" : "monthly";
    // salaryData(selectedDuration)

})


/**country start here  */
const toggleCountryList = (e) => {
    // console.info(e, 'e')
    if (e) {
        e.stopPropagation();
        if (e.target.value) {
            e.target.value = ''
        }
        const text = "";
        countryListEl.classList.toggle("list-modal");
        currencyListEl.classList.add("list-modal");
        provinceListEle.classList.add("list-modal");

        filterList(countryList, text, "country-list");
        // checkDisabledBtn();
    } else {
        countryListEl.classList.remove("list-modal");
    }
};

const toggleProvinceList = (e) => {

    if (e) {
        e.stopPropagation();
        if (e.target.value) {
            e.target.value = ''
        }
        const text = "";
        provinceListEle.classList.toggle("list-modal");
        countryListEl.classList.add("list-modal");
        currencyListEl.classList.add("list-modal");
        // provinceListEle.classList.add("list-modal");
        filterList(getProvince, text, "province-list");
        // checkDisabledBtn();
    } else {
        provinceListEle.classList.remove("list-modal");
    }
};

countryDownArrow.addEventListener('click', toggleCountryList)
countryInput.addEventListener("click", toggleCountryList);
provinceInput.addEventListener("click", toggleProvinceList);

countryInput.addEventListener("blur", (e) => {
    const text = e.target.value;
    const isEqual = countryList.find(
        (item) => item.label.toLowerCase() === text.toLowerCase()
    );
    if (!isEqual) countryInput.value = "";
});

const provinceListElOnClick = (e) => {
    e.preventDefault();
    if ('Item not found' === e.target.innerText) return;
    if (e.target.nodeName === "UL") return;
    provinceInput.value = e.target.innerText;
    // provinceInput.previousElementSibling.style.display = 'none'
    // checkDisabledBtn();
    // currencyCurSelect(e.target.innerText);
    // toggleCountryList(e);
};
// const provinceContainer = document.getElementById('show-calc-province')
let getProvince = []


function provinceAndIsExpatHandler(text) {
    const countryProvince = countryList.find(item => item.label === text)
    // console.log(countryProvince, 'countryProvince')
    getProvince = countryProvince.provinceList.map(item => ({ label: item.province, value: item.provinceCode }))
    if (countryProvince.label === 'Canada') {
        provinceInput.setAttribute('placeholder', 'Province')
        document.getElementById("province-state").innerText = "Province"
    } else {
        provinceInput.setAttribute('placeholder', 'State')
        document.getElementById("province-state").innerText = "State"
    }

    getProvince.sort((a, b) => {
        const labelA = a.label.toUpperCase(); // ignore upper and lowercase
        const labelB = b.label.toUpperCase(); // ignore upper and lowercase

        if (labelA < labelB) {
            return -1; // labelA comes before labelB
        }
        if (labelA > labelB) {
            return 1; // labelA comes after labelB
        }
        return 0; // labels are equal
    });

    if (getProvince.length) {
        document.getElementById('show-calc-province').style.display = 'block'
        provinceInput.setAttribute("required", "")
        createList(getProvince.sort(), "province-list");

    } else {
        document.getElementById('show-calc-province').style.display = 'none'
        provinceInput.removeAttribute("required")
    }

    document.getElementById('is-expact-country').innerText = countryProvince.label

    if (countryProvince.isExpatApplicable) {
        document.getElementById('yes-2').checked = true
        // document.getElementById('is-expact-yes').checked = true
        document.getElementById('is-expact').style.display = 'flex'
    } else {
        document.getElementById('is-expact').style.display = 'none'
    }
}

const countryListElOnClick = (e) => {
    e.preventDefault();
    if ('Item not found' === e.target.innerText) return;
    if (e.target.nodeName === "UL") return;
    provinceInput.value = ''
    countryInput.value = e.target.innerText;
    currencyCurSelect(e.target.innerText);
    // console.info(e.target.innerText, 'txt')
    // toggleCountryList(e);
    createListCurrency(currencyList, 'currency-input');
    provinceAndIsExpatHandler(e.target.innerText)
    // checkDisabledBtn();

    // countryInput.previousElementSibling.style.display = 'none'
};

countryListEl.addEventListener("click", countryListElOnClick);
provinceListEle.addEventListener("click", provinceListElOnClick);

countryInput.addEventListener("input", (e) => {
    const text = e.target.value;
    filterList(countryList, text, "country-list");
    toggleCountryList()
});

provinceInput.addEventListener("input", (e) => {
    const text = e.target.value;
    filterList(getProvince, text, "province-list");
    toggleProvinceList()
});
/**country end here */

/**currency start here  */

const toggleCurrencyList = (e) => {
    e.stopPropagation();
    const text = e.target.value || "";
    currencyListEl.classList.toggle("list-modal");
    countryListEl.classList.add("list-modal");
    filterList(currencyList, text, "currency-list");
    // checkDisabledBtn()
};


/*currency end here */

document.body.addEventListener("click", () => {
    const els = document.querySelectorAll(".list-cotainer");
    els.forEach((el) => el.classList.add("list-modal"));
});

/* aroowdown and up key country select key  */
countryInput.addEventListener("keydown", (e) => {
    const keyName = e.key;
    const activeEl = countryListEl.querySelector(".active");

    if (keyName === "ArrowDown") {
        const firstChildEle = countryListEl.firstChild;
        if (firstChildEle.innerText === 'Item not found') return;
        if (!activeEl) {
            firstChildEle.classList.add("active");
        } else {
            const nextEl = activeEl.nextSibling;
            activeEl.classList.remove("active");
            nextEl.classList.add("active");
        }

        activeEl.scrollIntoView({
            block: "center",
        });
    } else if (keyName === "ArrowUp") {
        const lastChildEle = countryListEl.lastChild;
        if (!activeEl) {
            lastChildEle.classList.add("active");
        } else {
            const nextEl = activeEl.previousSibling;
            activeEl.classList.remove("active");
            nextEl.classList.add("active");
        }
        activeEl.scrollIntoView({
            block: "center",
        });
    } else if (keyName === "Enter") {
        e.preventDefault();

        provinceAndIsExpatHandler(activeEl.innerText)
        countryInput.value = activeEl.innerText;
        countryListEl.classList.add("list-modal");
        currencyCurSelect(activeEl.innerText);
        // toggleCountryList(e);
        console.info(activeEl.innerText, 'activeEl.innerText')
        createListCurrency(currencyList, 'currency-input');
        // countryInput.previousElementSibling.style.display = 'none'
    }

});

provinceInput.addEventListener("keydown", (e) => {
    const keyName = e.key;
    const activeEl = provinceListEle.querySelector(".active");
    if (keyName === "ArrowDown") {
        const firstChildEle = provinceListEle.firstChild;
        if (firstChildEle.innerText === 'Item not found') return;
        if (!activeEl) {
            firstChildEle.classList.add("active");
        } else {
            const nextEl = activeEl.nextSibling;
            activeEl.classList.remove("active");
            nextEl.classList.add("active");
        }

        activeEl.scrollIntoView({
            block: "center",
        });
    } else if (keyName === "ArrowUp") {
        const lastChildEle = provinceListEle.lastChild;
        if (!activeEl) {
            lastChildEle.classList.add("active");
        } else {
            const nextEl = activeEl.previousSibling;
            activeEl.classList.remove("active");
            nextEl.classList.add("active");
        }
        activeEl.scrollIntoView({
            block: "center",
        });
    } else if (keyName === "Enter") {
        e.preventDefault();
        provinceInput.value = activeEl.innerText;
        provinceListEle.classList.add("list-modal");

        // provinceInput.previousElementSibling.style.display = 'none'

    }
});

// function provideCountryToFormHeader(countryName) {
//     document.getElementById('your-country').innerText = countryName

// }

// getInitialInputDetails(comData.country, comData.currencyCode, grossSalaryInput.value = 10000, provinceInput.value = "NA", comData.isExpat)
function getInitialInputDetails(country, currency, salary, province, isExpat) {
    let apiCalled = false;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzgF8aidOHLXmqtZhlqYgWOwbd2h14bSFU5GmvceliYzFGnsLtuhMQItBMm1ohtcs2n/exec';

    // const emailField = reqform.elements['email']; // Assuming 'email' is the name of your email field
    const ga_id = document.getElementById('ga_id')

    const formData = new FormData();
    formData.append('country', country);
    formData.append('currency', currency);
    formData.append('salary', salary)
    formData.append('province', province);
    formData.append('isExpat', isExpat);
    formData.append('ga_id', ga_id.value);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (response.ok) {
                // console.log("Thank you! submitted successfully.");
                apiCalled = true;
                // You might reload the page here if needed
                // window.location.reload();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => console.log('Error!', error.message));
};


// use for scroll behavior 
document.querySelector(".calc-again").addEventListener("click", () => {
    document.documentElement.style.scrollBehavior = "inherit";
})


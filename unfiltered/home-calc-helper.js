


// this is use for salary calculator main. url => skuad.io/salary-calculator


export const currencyLocalMap = {
    INR: "en-IN",
    USD: "en-US",
    IDR: "id-ID"
};

const currencyFormat = ({
    amount,
    currency,
    fixedBy = 2,
    locale = navigator.language,
}) => {
    let formattedCurrency = "-";
    try {
        if (amount || amount === 0) {
            amount = Number(amount).toFixed(fixedBy);
            const splittedValue = String(amount).split(".");
            formattedCurrency = `${currency ? currency + " " : ""}${Intl.NumberFormat(
                currencyLocalMap[currency] || locale
            ).format(splittedValue[0])}.${splittedValue[1]}`;
        }
    } catch (e) { }
    return formattedCurrency;
};


export const commaSeprateVal = (value) => {
    var tempNumber = value.toString().replace(/,/gi, "");
    var val = tempNumber.replace(/^0+|[^\d.]/g, '');
    var commaSeparatedNumber = val.split(/(?=(?:\d{3})+$)/).join(",");
    return commaSeparatedNumber
}

export default currencyFormat;

export const createList = (list = [], id = "country-list") => {
    // console.log(list,'cr')
    const element = document.getElementById(id);
    element.innerHTML = null;
    var frag = document.createDocumentFragment();
    for (let j = 0; j < list.length; j++) {
        const option = document.createElement("li");
        const item = list[j];
        option.dataset.value = item.value;
        option.innerText = item.label;
        option.classList.add("list-items");
        frag.appendChild(option);
    }
    element.appendChild(frag);
};

export const createListCurrency = (list = [], id = "currency-input") => {
    // console.log(list,'list curr')
    const element = document.getElementById(id);
    element.innerHTML = null;
    // var frag = document.createDocumentFragment();

    for (let j = 0; j < list.length; j++) {
        const option = document.createElement("option");
        const item = list[j];
        option.value = item.value;
        option.innerText = item.label;
        option.classList.add("list-items");
        element.appendChild(option);

    }

};

export const filterList = (list = [], text = "", id) => {
    let filteredList = list.filter((item) =>
        item.label.toLowerCase().includes(text?.toLowerCase())
    );
    if (!filteredList.length) {
        filteredList = [{ label: 'Country is not found', disabled: true }]
    }
    createList(filteredList, id);
};

export const createTaxList = (data = [], currCode = "") => {
    // console.log(currCode, 'currCode')
    const innerFrag = document.createElement('div');
    innerFrag.classList.add("inner-breakup")
    const frag = document.createElement("div");
    frag.classList = "breakups-main cont-breakup hidden";

    const ulClass = `d-flex-new justify-content-space-between acc-item-container`;
    for (let index = 0; index < data.length; index++) {
        const dataItem = data[index];
        const ul = document.createElement("ul");
        ul.classList = ulClass;
        const firstLI = document.createElement("li");
        firstLI.innerHTML = dataItem.label;
        const secondLI = document.createElement("li");
        if (secondLI === null) continue;
        // console.log(dataItem.value, 'dataItem.value')
        const newTexValue = currencyFormat({ amount: dataItem.value, currency: currCode || 'USD' })
        //Math.abs(Number(parseFloat(dataItem.value || 0).toFixed(2)))
        secondLI.innerHTML = newTexValue;
        secondLI.classList.add("ml-auto")
        ul.appendChild(firstLI);

        ul.appendChild(secondLI);
        innerFrag.appendChild(ul);

    }
    frag.appendChild(innerFrag)
    return frag;
};

export const checkDisabledBtn = () => {
    const countryValue = document.getElementById('country-input').value
    const currencyValue = document.getElementById('currency-input').value
    const grossSalaryValue = document.getElementById('gross-salary-input').value
    const provinceListEle = document.getElementById('province-list')
    const provinceInputEle = document.getElementById('province-input').value
    const calculateBtn = document.getElementById('calculate-salary')
    const isProvinceVisible = provinceListEle.parentElement.style.display === 'block'
    // console.log(countryValue, currencyValue, grossSalaryValue, isProvinceVisible, isProvinceVisible, provinceInputEle, 'jjj')


    if (countryValue && currencyValue && grossSalaryValue && (!isProvinceVisible || (isProvinceVisible && provinceInputEle))) {
        calculateBtn.removeAttribute('disabled')
        calculateBtn.classList.add('calculate-active');
    }
    else {
        calculateBtn.setAttribute('disabled', true)
    }
}

// export const updateMeta = (meta) => {
//     // console.log(meta,'mmm')
//     const ul = document.createElement('ul')
//     meta.forEach((item, index) => {
//         if (index == 0) {
//             // const additionalText = document.createElement("p");
//             // additionalText.classList.add('meta-first-element')
//             const li = document.createElement('li');
//             li.classList.add('calculator-dsc')
//             li.innerHTML = `<span>Note:</span> ${item}`
//             // additionalText.innerHTML = "<strong>Note: </strong>" + `<li class="meta-first calculator-dsc">${item}</li>`;
//             ul.appendChild(li);
//         } else {

//             const li = document.createElement('li');
//             li.innerText = item.replace(/[\r\n]/gm, '');
//             ul.appendChild(li);
//             li.classList.add('calculator-dsc');
//         }
//     })

//     const desContainer = document.getElementById('dsc-container');
//     desContainer.innerHTML = "";
//     desContainer.appendChild(ul);
// }

let isExpanded = false
const readMore = document.getElementById('read-more-container');
function showMoreItems(ul) {
    const allChilds = ul.children
    for (let i = 2; i < allChilds.length; i++) {
        allChilds[i].style.display = isExpanded ? 'none' : 'block';
    }
    const spanText = readMore.querySelector('span');
    const readMoreImg = readMore.querySelector('img');

    readMoreImg.style.rotate = isExpanded ? '360deg' : '180deg'
    spanText.innerText = isExpanded ? 'Read more' : 'Read less'
    isExpanded = !isExpanded
}

export const updateMeta = (meta) => {
    readMore.classList.remove('read-more-hide')
    const ul = document.createElement('ul')
    for (let i = 0; i < meta.length; i++) {
        const li = document.createElement('li');
        if (i > 1) {
            li.style.display = 'none'
        }
        li.innerText = meta[i].replace(/[\r\n]/gm, '');
        ul.appendChild(li);
        li.classList.add('calculator-dsc');
    }
    const desContainer = document.getElementById('dsc-container');
    desContainer.innerHTML = "";
    desContainer.appendChild(ul);
    const dscContainerMeta = meta.length;
    if (dscContainerMeta > 2) {
        readMore.classList.add('d-more-list-btn')
        readMore.addEventListener('click', () => showMoreItems(ul))
    }
    else {
        readMore.classList.remove('d-more-list-btn')
    }
}


// const errorElement = document.getElementById('err-msg');
export const createSuggestedCountryList = (suglist) => {
    const sugUlList = document.getElementById('suggestedCountries')
    suglist.forEach(element => {
        const li = document.createElement('li');
        const countryLink = document.createElement('a')
        const sugCountryName = element.label
        const sugCountryCode = element.value
        countryLink.innerText = sugCountryName
        countryLink.setAttribute("data-code", sugCountryCode)
        li.appendChild(countryLink)
        sugUlList.appendChild(li)

    });
}

const toolTipEle = `<div class="tool-tip">

<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><g clip-path="url(#svg_A)" stroke-width="1.2"><path d="M16.5 9a7.5 7.5 0 1 0-15 0 7.5 7.5 0 1 0 15 0z" fill="#0092f4" stroke="#0092f4" stroke-linejoin="round"/><path d="M7.516 7.509h1.486v5.236m-.565-7.293h1.125" stroke="#fff"/></g><defs><clipPath id="svg_A"><path fill="#fff" d="M0 0h18v18H0z"/></clipPath></defs></svg><span class="tooltiptext">__tooltiptext__</span>
</div>`

const arrowImage = `https://uploads-ssl.webflow.com/61cda68a44d858d793b97e11/6436b07536f3aab95d48a418_Arrow.svg`

const getParentsElement = (target, className) => {
    if (target.classList.contains(className)) return target;
    return getParentsElement(target.parentElement, className);

}
//  const toggleArrow = document.getElementById('toggle-arrow');

function toggleBreakUpHeight(growDiv) {
    if (growDiv.clientHeight > 20) {
        growDiv.style.height = 0;
    } else {
        const innerBreakup = growDiv.querySelector('.inner-breakup')
        growDiv.style.height = innerBreakup.clientHeight + 16 + "px";
    }

}

const toggleBreakups = (e) => {
    const mainAccordianElement = getParentsElement(e.target, "accordian-main");
    const breakUpMain = mainAccordianElement.nextSibling;
    breakUpMain.classList.toggle("hidden");
    const arrowImage = mainAccordianElement.children[0].lastChild
    arrowImage.classList.toggle('rotate-180');

    toggleBreakUpHeight(breakUpMain)
}


export const createAccordian = (data) => {
    const fragment = document.createElement("div")
    fragment.classList.add("accordian-section");
    // console.log(data, 'acc')
    const skuadFeeDiscount = data.find(item => item.key === "skuadFeeDiscount")
    const filteredData = data.filter(item => item.key !== "skuadFeeDiscount")


    filteredData.forEach(item => {
        const accordianMain = document.createElement("div")
        const accordianHeader = document.createElement("div")
        accordianHeader.classList = "accordian-main d-flex-new" // don't remove 'accordian-main' class
        accordianHeader.style.width = "100%"

        accordianHeader.style.justifyContent = "space-between"
        const accordianLeftSide = document.createElement("div");

        accordianLeftSide.classList = "d-flex-align-center"
        const accordianRightSide = document.createElement("div");
        accordianRightSide.classList = "d-flex-new"

        const accordianHeading = document.createElement("p");
        accordianHeading.classList.add('skuad-fee')
        accordianHeading.innerText = item.label;
        accordianLeftSide.appendChild(accordianHeading)

        const skuadFeeWrapper = document.createElement("div");
        skuadFeeWrapper.classList.add('new-heading-wrapper')
        skuadFeeWrapper.appendChild(accordianHeading)
        accordianLeftSide.appendChild(skuadFeeWrapper)

        if (item.key === "skuadFee" && skuadFeeDiscount) {

            const discountFeeLabel = document.createElement("div");
            discountFeeLabel.classList.add('skuad-offer-label')
            discountFeeLabel.innerText = 'Exclusive offer';
            accordianLeftSide.classList.add('dis-offer-active')
            accordianLeftSide.appendChild(discountFeeLabel)
        }

        if (item.tooltip) {
            const toolTipMain = document.createElement("div");
            toolTipMain.classList.add('tooltip-container')
            toolTipMain.innerHTML = toolTipEle.replace("__tooltiptext__", item.tooltip);
            skuadFeeWrapper.appendChild(toolTipMain)
        }

        if (item.subCategories.length) {
            const downArrow = document.createElement('img');
            downArrow.src = arrowImage;
            accordianLeftSide.appendChild(downArrow)
            accordianHeader.addEventListener("click", toggleBreakups)
        }
        const rightSideAccAmt = document.createElement("div");
        rightSideAccAmt.classList.add('right-inner-container')
        // const totalCurrency = document.createElement("p");
        // totalCurrency.classList.add("total-currency");
        // totalCurrency.innerText = item.currency || "USD";
        const totalTax = document.createElement("p");
        totalTax.classList.add('right-side-value')
        // totalCurrency.classList.add("total-tax");
        // totalTax.innerText = new Intl.NumberFormat().format(item.value)
        totalTax.innerText = currencyFormat({ amount: item.value, currency: item.currency || 'USD' })

        if (item.key === "skuadFee" && skuadFeeDiscount) {
            accordianRightSide.classList.add('offer-active')
            // rightSideAccAmt.appendChild(totalCurrency);
            rightSideAccAmt.appendChild(totalTax);
            accordianRightSide.appendChild(rightSideAccAmt);
        } else {
            // accordianRightSide.appendChild(totalCurrency);
            accordianRightSide.appendChild(totalTax);
        }

        if (item.key === "skuadFee" && skuadFeeDiscount) {
            const totalOldSkuadFee = item.value + skuadFeeDiscount.value
            const skuadFeeValueWrapper = document.createElement("div");
            skuadFeeValueWrapper.classList.add('skuad-dis-fee')
            const skuadFeeValue = document.createElement("p");
            // const skuadFeeCurrency = document.createElement("p");
            skuadFeeValue.classList.add('old-skuad-fee')
            // skuadFeeCurrency.innerText = item.currency || "USD";
            // skuadFeeValue.innerText = new Intl.NumberFormat().format(totalOldSkuadFee)
            skuadFeeValue.innerText = currencyFormat({ amount: totalOldSkuadFee, currency: item.currency || 'USD' })


            // skuadFeeValueWrapper.appendChild(skuadFeeCurrency);
            skuadFeeValueWrapper.appendChild(skuadFeeValue);
            accordianRightSide.appendChild(skuadFeeValueWrapper);
        }

        accordianHeader.appendChild(accordianLeftSide);
        accordianHeader.appendChild(accordianRightSide);

        const breakupsEles = createTaxList(item.subCategories, item.currency)

        accordianMain.appendChild(accordianHeader)
        // accordianMain.classList.add('skuad-fee-container')
        // console.log(accordianMain,'accordianMain')

        if (breakupsEles) {
            accordianMain.appendChild(breakupsEles)
        }

        fragment.appendChild(accordianMain)
    })

    return fragment;
}


export const createSalaryTemplate = (data) => {
    const frag = document.createDocumentFragment();
    data.forEach((item) => {
        const grossValue = item.data.filter(item => item.visibility)

        const sectionDiv = document.createElement("div")
        sectionDiv.classList.add("salary-contribution");

        const heading = document.createElement("h2");
        heading.innerText = item.label;

        const durationSalaryDiv = document.createElement("div");
        durationSalaryDiv.classList.add("cost-label-align");

        const durationTitle = document.createElement("p");
        durationTitle.classList.add("duration-title");
        durationTitle.innerText = item.grossSalaryTitle;

        durationSalaryDiv.appendChild(durationTitle);

        const durationRight = document.createElement("div");
        durationRight.classList.add('d-flex-new')

        // const currenyType = document.createElement("p");
        // currenyType.classList.add("currency-type");
        // currenyType.innerText = item.currency || "USD";

        const durationSalary = document.createElement("p");
        durationSalary.classList.add("duration-salary");
        // durationSalary.innerText = Math.abs(Number(parseFloat(item.grossSalary || 0).toFixed(2)) || 0);
        // durationSalary.innerText = new Intl.NumberFormat().format(item.grossSalary)
        durationSalary.innerText = currencyFormat({ amount: item.grossSalary, currency: item.currency || 'USD' })

        // durationRight.appendChild(currenyType)
        durationRight.appendChild(durationSalary)

        durationSalaryDiv.appendChild(durationRight)

        sectionDiv.appendChild(heading);
        sectionDiv.appendChild(durationSalaryDiv);

        const accordians = createAccordian(item.data);
        sectionDiv.appendChild(accordians);


        const employmentCost = document.createElement("div");
        employmentCost.classList.add("employment-cost");

        const employmentCostLabel = document.createElement("p")
        employmentCostLabel.classList.add("employment-cost-label");
        employmentCostLabel.innerText = item.durationHeading;
        employmentCost.appendChild(employmentCostLabel);

        const employmentRight = document.createElement("div");
        employmentRight.classList.add("d-flex-new")

        // const employmentCurrenyType = document.createElement("p");
        // employmentCurrenyType.classList.add("currency-type");
        // employmentCurrenyType.innerText = item.currency || "USD";

        const employmentCostSalary = document.createElement("p");
        employmentCostSalary.classList.add("duration-salary");
        // employmentCostSalary.innerText = Math.abs(Number(parseFloat(item.totalEmploymentCost || 0).toFixed(2)) || 0);
        // employmentCostSalary.innerText = new Intl.NumberFormat().format(item.totalEmploymentCost)
        employmentCostSalary.innerText = currencyFormat({ amount: item.totalEmploymentCost, currency: item.currency || 'USD' })
        // employmentRight.appendChild(employmentCurrenyType)
        employmentRight.appendChild(employmentCostSalary)
        employmentCost.appendChild(employmentRight);

        // console.log(item.data, employmentCostSalary, employmentRight, 'data')
        if (item?.data?.length) {
            sectionDiv.appendChild(employmentCost)
        }
        frag.appendChild(sectionDiv);

    })

    const mainDiv = document.getElementById("calculation-wrapper");
    mainDiv.innerHTML = '';
    mainDiv.appendChild(frag);
    const second = document.querySelector('#calculation-wrapper');
    second.children[1].classList.add('second')
    // toggleDscBtn()

}
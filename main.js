
const list = document.querySelector("#list");
const selectFilter = document.querySelector("#location");
const ticketForm = document.querySelector("#ticketForm");
const filterSelect = document.querySelector("#filterResult");

const data = [
    {
      "id": 0,
      "name": "肥宅心碎賞櫻3日",
      "imgUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
      "area": "高雄",
      "description": "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
      "group": 87,
      "price": 1400,
      "rate": 10
    },
    {
      "id": 1,
      "name": "貓空纜車雙程票",
      "imgUrl": "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
      "area": "台北",
      "description": "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
      "group": 99,
      "price": 240,
      "rate": 2
    },
    {
      "id": 2,
      "name": "台中谷關溫泉會1日",
      "imgUrl": "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
      "area": "台中",
      "description": "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
      "group": 20,
      "price": 1765,
      "rate": 7
    }
];

let str = '';

const clearForm = () => {
  ticketForm.reset();
}

const filterResult = (e) => {
  const filter = e;

  if (filter === "全部" || filter === "" || filter === undefined) {
    filterSelect.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
    return render(data);
  } else {
    const filteredData = data.filter((item) => item.area === filter);
    filterSelect.innerHTML = `本次搜尋共 ${filteredData.length} 筆資料`;
    return render(filteredData);
  }
};

selectFilter.addEventListener("change", (e) => {
  filterResult(e.target.value);
});

ticketForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(ticketForm);
  const name = formData.get("ticketName");
  const area = formData.get("attractions");
  const description = formData.get("ticketDesc");
  const group = formData.get("ticketAmount");
  const price = formData.get("ticketPrice");
  const rate = formData.get("ticketRate");
  const imgUrl = formData.get("imgUrl");
  const newData = {
    "id": data.length + 1,
    "name": name,
    "imgUrl": imgUrl,
    "area": area,
    "description": description,
    "group": group,
    "price": price,
    "rate": rate
  }
  // https://picsum.photos/500/300
  const urlRegex = new RegExp(
    /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/
  );
  if (!urlRegex.test(imgUrl)) {
    alert("請輸入正確的網址");
    return;
  }
  if (description === "") {
    newData.description = "使用者很懶沒有留下任何訊息";
  }
  if (rate === "") {
    newData.rate = 0;
  }
  console.log(name, price, rate, imgUrl, area, description, group);
  data.push(newData);
  render(data);
  store(data);
  clearForm();
  filterResult();
});


const render = (Array) => {
  str = "";
  Array.forEach((item) => {
    str += `
        <li class="bg-white shadow border rounded border-[#DEE2E6] md:w-1/2 lg:w-4/12 max-w-[80vw] md:max-w-[300px] lg:max-w-[350px] flex flex-col" data-key="${item.id}">
          <div class="relative">
            <div class="rounded-t overflow-hidden">
              <picture>
                <source media="(min-width: 768px)" srcset="${item.imgUrl}" class="duration-500 hover:scale-[105%] origin-center object-fill">
                <img src="${item.imgUrl}" alt="ticket01" class="duration-500 hover:scale-[105%] origin-center object-fill">
              </picture>
            </div>
            <span class="absolute top-0 -translate-y-1/3 bg-secondary text-white py-2 px-5 rounded-r">${item.area}</span>
            <span class="absolute bottom-0 translate-y-1/2 bg-primary text-white py-1 px-2">${item.rate}</span>
          </div>
          <div class="p-5 flex flex-col h-full">
            <h2 class="text-primary border-bottom border-primary font-medium text-2xl pb-1 border-b-2 mb-4">${item.name}</h2>
            <p class="text-gray mb-6 flex-1">${item.description}</p>
            <div class="flex justify-between items-center text-primary">
              <div class="flex items-center">
                <i class="bi bi-exclamation-circle-fill mr-2"></i>
                <p class="font-medium">剩下最後 ${item.group} 組</p>
              </div>
              <div class="flex items-center">
                <span class="text font-medium mr-1">TWD</span>
                <span class="text-2xl font-roboto font-medium">$${item.price}</span>
              </div>
            </div>
          </div>
        </li>
`;
  });

  list.innerHTML = str;
}

//store local storage
const store = (data) => {
  localStorage.setItem("ticketData", JSON.stringify(data));
}


const init = () => {
  filterResult.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
  let localData;
  if (localStorage.getItem("ticketData")) {
    localData = JSON.parse(localStorage.getItem("ticketData"));
    render(localData);
  } else {
    render(data);
  }
}


init();
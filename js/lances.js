window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    document.querySelector("nav")?.classList.add("active");
    return;
  }
  document.querySelector("nav")?.classList.remove("active");
});

const renderRefetchButton = () => {
  document.querySelector("#content").innerHTML = `
    <div class="w-full flex">
      <button class="ml-auto btn-soft-primary" onClick="getData()">Atualizar dados</button>
    </div>
  `;
};

const renderSkeleton = () => {
  document.querySelector("#content").innerHTML = `
    <div class="bg-slate-200 rounded-md w-[150px] h-[40px] ml-auto"></div>

    <div class="animate-pulse flex flex-col gap-8 mt-12">
      <div class="bg-slate-200 rounded-xl w-full h-[500px]"></div>
      <div class="bg-slate-200 rounded-xl w-full h-[500px]"></div>
      <div class="bg-slate-200 rounded-xl w-full h-[500px]"></div>
      <div class="bg-slate-200 rounded-xl w-full h-[500px]"></div>
      <div class="bg-slate-200 rounded-xl w-full h-[500px]"></div>
      </div>
    </div>
  `;
};

const removeSkeleton = () =>
  (document.querySelector("#content").innerHTML = ``);

const handleDigits = (value) => {
  if (Number(value) < 10) return `0${value}`;
  return value;
};

let i = 0;
const renderTable = (title, details) => {
  i++;

  if (i === 1) renderRefetchButton();

  document.querySelector("#content").innerHTML += `
        <div class="p-4 md:p-8 bg-slate-100 rounded-xl mt-12">
            <strong class="text-3xl text-slate-600">${title}</strong>
            
            <div class="overflow-x-auto mt-8">
                <table class="w-full">
                    <thead>
                        <tr class="border-b">
                            <th class="border-r min-w-[220px] md:min-w-[0px] md:w-6/12 px-8 md:px-0 py-4">Site</th>
                            <th class="border-r min-w-[220px] md:min-w-[0px] md:w-6/12 px-8 md:px-0 py-4">Lances</th>
                        </tr>
                    </thead>

                    <tbody id="body-${i}"></tbody>
                </table>
            </div>
        </div>
    `;

  details.forEach((detail) => {
    document.querySelector(`#body-${i}`).innerHTML += `
            <tr class="table-base-tr">
                <td class="min-w-[220px] md:min-w-[0px] md:w-6/12 px-8 md:px-0 text-center py-4">${detail.site.slice(
                  0,
                  detail.site.length - 3
                )}</td>
                <td class="min-w-[220px] md:min-w-[0px] md:w-6/12 px-8 md:px-0 text-center py-4">${
                  detail.lances
                }</td>
            </tr>
        `;
  });
};

const getData = async () => {
  renderSkeleton();
  const res = await axios.get("https://bot.hostingbr.cloud/api/lances");
  removeSkeleton();

  const data = res.data;

  const resultado = [];

  for (const date in data[0]) {
    if (date !== "Site") {
      const details = [];

      for (const obj of data) {
        const site = obj["Site"];
        const lances = parseInt(obj[date]);
        details.push({ site, lances });
      }

      const dateFormatted = new Date(date);
      dateFormatted.setDate(dateFormatted.getDate() + 1);
      const day = handleDigits(dateFormatted.getDate());
      const month = handleDigits(dateFormatted.getMonth() + 1);
      const year = dateFormatted.getFullYear();
      title = `${day}/${month}/${year}`;

      renderTable(title, details);
    }
  }

  i = 0;
};

getData();

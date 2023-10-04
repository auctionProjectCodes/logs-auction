window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    document.querySelector("nav")?.classList.add("active");
    return;
  }
  document.querySelector("nav")?.classList.remove("active");
});

const handleDigits = (value) => {
  if (Number(value) < 10) return `0${value}`;
  return value;
};

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
                            <th class="border-r min-w-[220px] md:min-w-[0px] md:w-[33,333333333%] px-8 md:px-0 py-4">Site</th>
                            <th class="border-r min-w-[220px] md:min-w-[0px] md:w-[33,333333333%] px-8 md:px-0 py-4">Documentos</th>
                            <th class="min-w-[220px] md:min-w-[0px] md:w-[33,333333333%] px-8 md:px-0 py-4">Cadastros</th>
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
                <td class="min-w-[220px] md:min-w-[0px] md:w-[33,333333333%] px-8 md:px-0 text-center py-4">${detail.site.slice(
                  0,
                  detail.site.length - 3
                )}</td>
                <td class="min-w-[220px] md:min-w-[0px] md:w-[33,333333333%] px-8 md:px-0 text-center py-4">${
                  detail.docs
                }</td>
                <td class="min-w-[220px] md:min-w-[0px] md:w-[33,333333333%] px-8 md:px-0 text-center py-4">${
                  detail.total
                }</td>
            </tr>
        `;
  });
};

const getData = async () => {
  renderSkeleton();
  const res = await axios.get("https://bot.hostingbr.cloud/api/cadastros");
  removeSkeleton();

  const data = [];

  Object.keys(res.data).forEach((key) => {
    let title = "";

    if (key === "aggregated") {
      title = "Resumo";
    } else {
      const dateFormatted = new Date(key);
      dateFormatted.setDate(dateFormatted.getDate() + 1);
      const day = handleDigits(dateFormatted.getDate());
      const month = handleDigits(dateFormatted.getMonth() + 1);
      const year = dateFormatted.getFullYear();
      title = `${day}/${month}/${year}`;
    }

    const tmp = [];

    Object.keys(res.data[key]).forEach((site) => {
      const docs = res.data[key][site].docs_cad;
      const total = res.data[key][site].total_cadastros;

      tmp.push({ site, docs, total });
    });

    renderTable(title, tmp);
  });

  i = 0;
};
getData();

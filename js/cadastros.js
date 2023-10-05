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
        <div class="px-2 py-8 md:px-8 bg-slate-100 rounded-xl mt-12">
            <strong class="text-lg md:text-xl text-slate-600">${title}</strong>
            
            <table class="w-full mt-8">
                <thead>
                    <tr>
                        <th class="px-2 py-4 break-words text-xs md:text-base">Site</th>
                        <th class="px-2 py-4 break-words text-xs md:text-base">Cadastros</th>
                        <th class="px-2 py-4 break-words text-xs md:text-base">Documentos</th>
                    </tr>
                </thead>

                <tbody id="body-${i}"></tbody>
            </table>
        </div>
    `;

  details.forEach((detail) => {
    document.querySelector(`#body-${i}`).innerHTML += `
            <tr class="table-base-tr">
                <td class="px-2 py-4 text-center break-words text-xs md:text-base">${detail.site.slice(
                  0,
                  detail.site.length - 3
                )}</td>
                <td class="px-2 py-4 text-center break-words text-xs md:text-base">${
                  detail.total
                }</td>
                <td class="px-2 py-4 text-center break-words text-xs md:text-base">${
                  detail.docs
                }</td>
            </tr>
        `;
  });
};

const getData = async () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const pagina = params.get("pagina");

  try {
    renderSkeleton();
    const res = await axios.get(
      `https://bot.hostingbr.cloud/api/cadastros${pagina > 1 ? pagina : ""}`
    );
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

      data.push({ title, details: tmp });
    });

    data.map((item) => {
      return {
        ...item,
        details: item.details.sort((a, b) => b.total - a.total),
      };
    });

    data.forEach((item) => renderTable(item.title, item.details));
  } catch (e) {
    removeSkeleton();
    document.querySelector("#content").innerHTML = `
      <div class="flex flex-col items-center mt-48">
        <p>Nenhum resultado encontrado</p>
        <button class="btn-soft-primary mt-8" onClick="getData()">Atualizar dados</button>
      </div>
    `;
  }

  i = 0;
};
getData();

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
      <button class="ml-auto btn-soft-primary" onClick="updateData()">Atualizar dados</button>
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
            <strong class="text-lg md:text-xl text-slate-600">${title}</strong>
            
            <table class="w-full mt-8">
                <thead>
                    <tr class="border-b">
                        <th class="px-2 py-4 break-words text-xs md:text-base">Site</th>
                        <th class="px-2 py-4 break-words text-xs md:text-base">Lances</th>
                    </tr>
                </thead>

                <tbody id="body-${i}"></tbody>
            </table>
        </div>
    `;

  details.forEach((detail) => {
    document.querySelector(`#body-${i}`).innerHTML += `
            <tr class="table-base-tr">
                <td class="px-2 py-4 text-center break-words text-xs md:text-base w-6/12">${detail.site.slice(
                  0,
                  detail.site.length - 3
                )}</td>
                <td class="px-2 py-4 text-center break-words text-xs md:text-base w-6/12">${
                  detail.lances
                }</td>
            </tr>
        `;
  });
};

const updateData = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  params.set("pagina", 1);
  url.search = params.toString();
  window.location.href = url.toString();
};

const handleURL = (e) => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("pagina") || 1;

  window.location.href = `${e.dataset.url}?pagina=${page}`;
};

const getData = async (pageParam) => {
  try {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const page = pageParam || params.get("pagina");

    renderSkeleton();
    const res = await axios.get(
      `https://bot.hostingbr.cloud/api/lances${page > 1 ? page : ""}`
    );
    removeSkeleton();

    const data = res.data;

    const result = [];

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

        result.push({ title, details });
      }
    }

    const currentDate = new Date();
    result.sort((a, b) => {
      const differenceA = Math.abs(a.title - currentDate);
      const differenceB = Math.abs(b.title - currentDate);
      return differenceA - differenceB;
    });

    result.map((item) => {
      return {
        ...item,
        details: item.details.sort((a, b) => b.lances - a.lances),
      };
    });

    result.forEach((item) => renderTable(item.title, item.details));

    i = 0;
  } catch (e) {
    removeSkeleton();
    document.querySelector("#content").innerHTML = `
      <div class="flex flex-col items-center mt-48">
        <p>Nenhum resultado encontrado</p>
        <button class="btn-soft-primary mt-8" onClick="updateData()">Atualizar dados</button>
      </div>
    `;
  }
};

getData();

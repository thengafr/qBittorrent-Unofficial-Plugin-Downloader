const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
document.head.appendChild(script);

script.onload = async () => {
  const zip = new JSZip();

  const links = [...new Map(
    [...document.querySelectorAll("tbody a[href]")]
      .filter(a => a.href.endsWith(".py"))
      .map(a => [a.href.split("/").pop(), a.href])
  ).values()];

  console.log(`Downloading ${links.length} python files`);

  for (const url of links) {
    const name = url.split("/").pop();

    const response = await fetch(url);
    const blob = await response.blob();

    zip.file(name, blob);

    console.log("Added:", name);
  }

  const content = await zip.generateAsync({type: "blob"});

  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "python-files.zip";

  document.body.appendChild(a);
  a.click();
  a.remove();

  console.log("ZIP created");
};

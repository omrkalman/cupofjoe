const handler = (ev: React.MouseEvent<HTMLButtonElement> & {target: {name: string}}) => {
    const elem = document.getElementById(ev.target.name);
    const y = elem?.offsetTop || 100;
    window.scroll({ top: y, behavior: "smooth" });
}

export default handler;
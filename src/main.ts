function openMenu(evt: Event, menuName: string): void {
   let i: number;
   let x: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("menu") as HTMLCollectionOf<HTMLElement>;
   for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
   }

   let tablinks: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tablink") as HTMLCollectionOf<HTMLElement>;
   for (i = 0; i < tablinks.length; i++) {
       tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
   }

   document.getElementById(menuName)!.style.display = "block";
   (evt.currentTarget as HTMLElement).firstElementChild!.className += " w3-red";
}

document.getElementById("myLink")!.click();

export type Table = {
  no: number;
  x: number;
  y: number;
  guests: string[];
};

export const headTable = { label: "Para młoda i świadkowie" };

export const tables: Table[] = [
  { no: 1, x: 120, y: 170, guests: ["Anna Kowalska", "Bartek Nowak", "Celina Wiśniewska", "Dawid Wójcik", "Ewa Kamińska", "Filip Lewandowski"] },
  { no: 2, x: 120, y: 300, guests: ["Gosia Zielińska", "Hubert Szymański", "Iza Woźniak", "Jakub Dąbrowski", "Kasia Kozłowska", "Leszek Jankowski"] },
  { no: 3, x: 120, y: 430, guests: ["Magda Mazur", "Norbert Kwiatkowski", "Ola Krawczyk", "Piotr Piotrowski", "Renata Grabowska", "Sebastian Pawłowski"] },
  { no: 4, x: 680, y: 170, guests: ["Teresa Michalska", "Tomek Nowicki", "Urszula Adamczyk", "Wiktor Dudek", "Zosia Zając", "Adam Wieczorek"] },
  { no: 5, x: 680, y: 300, guests: ["Beata Jabłońska", "Cezary Król", "Dorota Majewska", "Emil Olszewski", "Fryderyk Jaworski", "Grażyna Malinowska"] },
  { no: 6, x: 680, y: 430, guests: ["Henryk Pawlak", "Irena Witkowska", "Jan Walczak", "Karolina Stępień", "Łukasz Górski", "Monika Rutkowska"] },
  { no: 7, x: 310, y: 470, guests: ["Natalia Michalak", "Oskar Sikora", "Paulina Ostrowska", "Radek Baran", "Sylwia Duda", "Tadeusz Szewczyk"] },
  { no: 8, x: 490, y: 470, guests: ["Weronika Tomaszewska", "Zbigniew Pietrzak", "Agata Marciniak", "Borys Wróbel", "Celestyna Zalewska", "Dominik Jakubowski"] },
];

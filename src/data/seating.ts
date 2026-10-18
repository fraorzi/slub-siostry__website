export type Table = {
  no: number;
  x: number;
  y: number;
  guests: string[];
};

// Układ przykładowy na rzucie sali bankietowej Miodowego Zakątka (stoły okrągłe, do 94 osób):
// trzy rzędy przodem do stołu pary, przy wejściu wolne przejście. Prawdziwe przypisanie i liczba stołów od pary.
export const headTable = { label: "Para młoda i świadkowie" };

export const tables: Table[] = [
  { no: 1, x: 100, y: 190, guests: ["Anna Kowalska", "Bartek Nowak", "Celina Wiśniewska", "Dawid Wójcik", "Ewa Kamińska", "Filip Lewandowski"] },
  { no: 2, x: 280, y: 190, guests: ["Gosia Zielińska", "Hubert Szymański", "Iza Woźniak", "Jakub Dąbrowski", "Kasia Kozłowska", "Leszek Jankowski"] },
  { no: 3, x: 460, y: 190, guests: ["Magda Mazur", "Norbert Kwiatkowski", "Ola Krawczyk", "Piotr Piotrowski", "Renata Grabowska", "Sebastian Pawłowski"] },
  { no: 4, x: 100, y: 320, guests: ["Teresa Michalska", "Tomek Nowicki", "Urszula Adamczyk", "Wiktor Dudek", "Zosia Zając", "Adam Wieczorek"] },
  { no: 5, x: 280, y: 320, guests: ["Beata Jabłońska", "Cezary Król", "Dorota Majewska", "Emil Olszewski", "Fryderyk Jaworski", "Grażyna Malinowska"] },
  { no: 6, x: 460, y: 320, guests: ["Henryk Pawlak", "Irena Witkowska", "Jan Walczak", "Karolina Stępień", "Łukasz Górski", "Monika Rutkowska"] },
  { no: 7, x: 100, y: 450, guests: ["Natalia Michalak", "Oskar Sikora", "Paulina Ostrowska", "Radek Baran", "Sylwia Duda", "Tadeusz Szewczyk"] },
  { no: 8, x: 460, y: 450, guests: ["Weronika Tomaszewska", "Zbigniew Pietrzak", "Agata Marciniak", "Borys Wróbel", "Celestyna Zalewska", "Dominik Jakubowski"] },
];

import "./style.css";
import { handleNo, handleYes } from "./utils";

document.getElementById("yes")!.addEventListener("click", handleYes)!;
document.getElementById("no")!.addEventListener("click", handleNo)!;
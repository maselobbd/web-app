import { environment } from "../../../environment/environment";

export function generateQuestionnaireLink(email:string, fullName:string) {
    let link = environment.questionnaireLink;
    link = link.replace('fullName', encodeURIComponent(fullName));
    link = link.replace('email', encodeURIComponent(email));
    return link;
  }
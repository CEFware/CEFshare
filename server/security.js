//nobody may remove & update 
Emails.permit(['remove','update']).never().apply();

//anybody may insert
Emails.permit(['insert']).apply();


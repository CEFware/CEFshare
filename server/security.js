//nobody may remove & update 
Emails.permit(['remove','update']).never().apply();

//anybody may insert
Emails.permit(['insert']).apply();

//Listings - only verified user may insert, admin & owner remove, only owner - update

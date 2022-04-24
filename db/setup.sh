#psql -f install.sql -U postgres
#PGPASSWORD=marcus psql -d bos -f structure.sql -U marcus
PGPASSWORD=marcus psql -d bos -f data.sql -U marcus

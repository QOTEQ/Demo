INSERT INTO "Account" ("login", "password") VALUES
  ('admin', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$XcD5Zfk+BVIGEyiksBjjy9LL42AFOOqlhEB650woECs$3CNOs25gOVV8AZMYQc6bFnrYdM+3xP996shxJEq5LxGt4gs1g9cocZmi/SYg/H16egY4j7qxTD/oygyEI80cgg'),
  ('marcus', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$aGKuH5D2zndi6zFu74/rEj5m3u5kRh5b+QXYfKrhAU8$257up1h/3R9CoxH2382zX0+kbxRPrd+GwzJIxYI+K+gBYCcLrA8Z6wv7lSwLElfbDTJRgUhQJFhMT1tpp5AJxw'),
  ('user', '$scrypt$N=32768,r=8,p=1,maxmem=67108864$z5uf2xGdpgq5v2sZbgh36QoZG9CDmGmJUNJkrs1zs2w$3s3x22k4Td0jkup4WduFQGFVjrFKHjN1WV9k8/Bh3DKI58Wrlo/D4Js9j/DiskwI8rltDd8pF15JylivFu2T0g');

-- Examples login/password
-- admin/123456
-- marcus/marcus
-- user/nopassword

INSERT INTO "Carrier" ("name") VALUES
  ('Postal service'),
  ('Courier service'),
  ('Pickup from store');

INSERT INTO "Product" ("name", "description", "amount", "price", "weight") VALUES
  ('Motorola Edge 20 Pro', 'Dual-Sim 256gb, 12gb RAM, 5G', 50, 20000, 0.190),
  ('Huawei D16 Laptop', 'AMD Ryzon 5, 16gb RAM, SSD 500gb', 10, 30000, 1.74),
  ('Vitelotte potatoes', 'Violet-blue, nutty flavour, chestnuts smell', 100, 75, 1),
  ('Gesture chair', 'Inspired by the movement of the human body', 25, 17000, 20);

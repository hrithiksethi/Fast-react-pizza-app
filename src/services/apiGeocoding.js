const BASE_URL = `https://us1.locationiq.com/v1/reverse`;
const KEY = 'pk.b3aaee66d4ccab426de00c1ed918a479';

export async function getAddress({ latitude, longitude }) {
  // const res = await fetch(
  //   `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
  // );
  const res = await fetch(
    `${BASE_URL}?key=${KEY}&lat=${latitude}&lon=${longitude}&format=json`,
  );
  if (!res.ok) throw Error('Failed getting address');

  const data = await res.json();
  return data;
}

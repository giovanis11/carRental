const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "/api");

const PICKUP_LOCATIONS = [
  "Athens - Leoforos Andrea Siggrou",
  "Athens Airport - Arrivals Terminal",
  "Glyfada Premium Pickup Point",
  "Marousi Business District Hub",
  "Piraeus Port Collection Point",
  "Kolonaki City Collection Lounge",
];

const CAR_META_BY_NAME = {
  "Fiat 500": {
    seats: 4,
    largeBags: 1,
    transmission: "Manual",
    type: "Small car",
  },
  "Peugeot 208": {
    seats: 5,
    largeBags: 1,
    transmission: "Automatic",
    type: "Medium car",
  },
  "Fiat Panda": {
    seats: 4,
    largeBags: 1,
    transmission: "Manual",
    type: "Small car",
  },
  "Kia Picanto": {
    seats: 4,
    largeBags: 1,
    transmission: "Manual",
    type: "Small car",
  },
  "Volkswagen Polo": {
    seats: 5,
    largeBags: 2,
    transmission: "Automatic",
    type: "Medium car",
  },
  "Toyota Yaris": {
    seats: 5,
    largeBags: 2,
    transmission: "Automatic",
    type: "Medium car",
  },
};

function buildCarSearchQuery(options = {}) {
  const params = new URLSearchParams();

  if (options.startDate && options.endDate) {
    params.set("start_date", options.startDate);
    params.set("end_date", options.endDate);
  }

  if (options.availableOnly) {
    params.set("available_only", "true");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function buildOptimizedImageUrl(url, width = 640) {
  const wikimediaMatch = url.match(/Special:FilePath\/([^?]+)/);

  if (!wikimediaMatch) {
    return url;
  }

  const filename = decodeURIComponent(wikimediaMatch[1]);
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(
    filename
  )}?width=${width}`;
}

function inferCarType(name, description) {
  if (CAR_META_BY_NAME[name]?.type) {
    return CAR_META_BY_NAME[name].type;
  }

  const content = `${name} ${description}`.toLowerCase();

  if (content.includes("suv")) {
    return "Large car";
  }

  if (content.includes("large")) {
    return "Large car";
  }

  if (content.includes("medium")) {
    return "Medium car";
  }

  if (
    content.includes("luxury") ||
    content.includes("premium") ||
    content.includes("executive")
  ) {
    return "Large car";
  }

  return "Small car";
}

function buildListingMeta(car, type) {
  const carMeta = CAR_META_BY_NAME[car.name] ?? {};
  const seats = carMeta.seats ?? (type === "Large car" ? 5 : 4);
  const largeBags = carMeta.largeBags ?? (type === "Large car" ? 2 : 1);
  const transmission =
    carMeta.transmission ?? (car.id % 2 === 0 ? "Automatic" : "Manual");

  return {
    seats,
    largeBags,
    transmission,
    mileage: "Unlimited mileage",
    pickupLocation: PICKUP_LOCATIONS[(car.id - 1) % PICKUP_LOCATIONS.length],
    distanceFromCenter: `${(1.1 + ((car.id - 1) % 5) * 0.4).toFixed(1)} km from centre`,
    similarLabel: `or similar ${type.toLowerCase()} car`,
  };
}

export function normalizeCar(car) {
  const type = inferCarType(car.name, car.description);
  const searchAvailable = car.is_available_for_dates ?? car.available;
  const image = buildOptimizedImageUrl(car.image_url, 640);
  const imageLarge = buildOptimizedImageUrl(car.image_url, 1200);
  const usesExternalVariants = image !== car.image_url || imageLarge !== car.image_url;

  return {
    id: car.id,
    name: car.name,
    pricePerDay: car.price_per_day,
    image,
    imageLarge,
    imageSrcSet: usesExternalVariants
      ? `${buildOptimizedImageUrl(car.image_url, 320)} 320w, ${image} 640w, ${imageLarge} 1200w`
      : undefined,
    description: car.description,
    available: car.available,
    searchAvailable,
    startDate: car.start_date ?? "",
    endDate: car.end_date ?? "",
    rentalDays: car.rental_days ?? null,
    totalPrice: car.total_price ?? null,
    type,
    ...buildListingMeta(car, type),
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = "Something went wrong";

    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }

    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchCars(options = {}) {
  const cars = await request(`/cars${buildCarSearchQuery(options)}`);
  return cars.map(normalizeCar);
}

export async function fetchCar(carId, options = {}) {
  const car = await request(`/cars/${carId}${buildCarSearchQuery(options)}`);
  return normalizeCar(car);
}

export async function createCar(payload) {
  const car = await request("/cars", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      price_per_day: Number(payload.pricePerDay),
      image_url: payload.image.trim(),
      description: payload.description.trim(),
      available: payload.available,
    }),
  });

  return normalizeCar(car);
}

export async function updateCar(carId, payload) {
  const car = await request(`/cars/${carId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: payload.name.trim(),
      price_per_day: Number(payload.pricePerDay),
      image_url: payload.image.trim(),
      description: payload.description.trim(),
      available: payload.available,
    }),
  });

  return normalizeCar(car);
}

export async function deleteCar(carId) {
  return request(`/cars/${carId}`, {
    method: "DELETE",
  });
}

export async function createBooking(payload) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify({
      car_id: payload.carId,
      start_date: payload.startDate,
      end_date: payload.endDate,
      customer_name: payload.customerName.trim(),
      email: payload.email.trim(),
    }),
  });
}

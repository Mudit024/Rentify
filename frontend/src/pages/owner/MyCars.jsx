import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PlusCircle, Pencil, Trash2, Car } from "lucide-react";
import {
  fetchOwnerCars,
  deleteOwnerCar,
} from "../../redux/slices/ownerSlice.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import { ROUTES, ownerEditCarRoute } from "../../constants/routes.js";
import { APPROVAL_STATUS_COLORS } from "../../constants/index.js";
import { formatCurrency } from "../../utils/formatters.js";

const MyCars = () => {
  const dispatch = useDispatch();
  const { cars, status } = useSelector((s) => s.owner);

  useEffect(() => {
    dispatch(fetchOwnerCars());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await dispatch(deleteOwnerCar(id)).unwrap();
      toast.success("Car deleted");
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to delete car.",
      );
    }
  };

  if (status === "loading") return <Spinner fullPage />;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
            My Cars
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {cars.length} premium listing{cars.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to={ROUTES.OWNER_ADD_CAR}>
          <Button className="rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-premium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <PlusCircle className="h-4.5 w-4.5" /> Add New Car
          </Button>
        </Link>
      </div>

      {cars.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No cars listed yet"
          description="List your first car and start earning."
          action={
            <Link to={ROUTES.OWNER_ADD_CAR}>
              <Button>List a Car</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {cars.map((car) => {
            const image =
              car.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80";
            return (
              <div
                key={car._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-premium hover:border-primary-500/20 transition-all duration-300"
              >
                <img
                  src={image}
                  alt={car.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80";
                  }}
                  className="h-24 w-full sm:w-36 rounded-xl object-cover shrink-0 shadow-sm border border-gray-100 dark:border-gray-800/50"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 dark:text-luxury-ivory text-lg truncate">
                      {car.title}
                    </h3>
                    <StatusBadge
                      status={car.approvalStatus}
                      colorMap={APPROVAL_STATUS_COLORS}
                    />
                    {!car.isAvailable && (
                      <span className="rounded-full bg-gray-100 dark:bg-gray-800/80 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {car.brand} {car.model} · {car.location}
                  </p>
                  <p className="font-extrabold text-gray-900 dark:text-luxury-ivory text-base">
                    {formatCurrency(car.pricePerDay)}
                    <span className="text-xs font-medium text-gray-500">
                      {" "}
                      /day
                    </span>
                  </p>
                  {car.approvalStatus === "rejected" && car.rejectionReason && (
                    <p className="text-xs font-bold text-red-500">
                      Reason: {car.rejectionReason}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                  <Link to={ownerEditCarRoute(car._id)} className="flex-1 sm:flex-initial">
                    <Button variant="outline" size="sm" className="w-full justify-center rounded-xl font-bold py-2">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    className="rounded-xl py-2 px-3 justify-center"
                    onClick={() => handleDelete(car._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCars;

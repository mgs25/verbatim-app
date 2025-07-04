using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Entities;

namespace server.Services.Interfaces
{
	public interface IDrillService
	{
		Task CreateDrillAsync(Drill drill);
		Task<List<Drill>> GetRecentDrills(string userId, int count);
	}
}

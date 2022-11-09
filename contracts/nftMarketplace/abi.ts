export default [{"type":"error","name":"ListingPriceNotPaid","inputs":[{"type":"uint256","name":"price"}]},{"type":"error","name":"ListingPriceNotProvided","inputs":[]},{"type":"error","name":"NftAlreadyListed","inputs":[]},{"type":"error","name":"NftNotApprovedForMarketPlace","inputs":[]},{"type":"error","name":"NftNotListed","inputs":[]},{"type":"error","name":"NoProceedsToWithdraw","inputs":[]},{"type":"error","name":"NotOwnerOfNft","inputs":[]},{"type":"error","name":"WithdrawProceedsFailed","inputs":[]},{"type":"event","anonymous":false,"name":"ListingUpdated","inputs":[{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"nftId","indexed":true},{"type":"uint256","name":"price","indexed":false},{"type":"address","name":"seller","indexed":false}]},{"type":"event","anonymous":false,"name":"NftBought","inputs":[{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"nftId","indexed":true},{"type":"address","name":"buyer","indexed":false},{"type":"uint256","name":"price","indexed":false}]},{"type":"event","anonymous":false,"name":"NftListed","inputs":[{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"nftId","indexed":true},{"type":"uint256","name":"price","indexed":false},{"type":"address","name":"seller","indexed":false}]},{"type":"event","anonymous":false,"name":"NftUnlisted","inputs":[{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"nftId","indexed":true}]},{"type":"function","name":"buyNft","constant":false,"stateMutability":"payable","payable":true,"gas":1099510627775,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"nftId"}],"outputs":[]},{"type":"function","name":"listNft","constant":false,"payable":false,"gas":1099510627775,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"nftId"},{"type":"uint256","name":"price"}],"outputs":[]},{"type":"function","name":"listingByNftIdByNftAddress","constant":true,"stateMutability":"view","payable":false,"gas":1099510627775,"inputs":[{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"uint256","name":"price"},{"type":"address","name":"seller"}]},{"type":"function","name":"numberOfListings","constant":true,"stateMutability":"view","payable":false,"gas":1099510627775,"inputs":[],"outputs":[{"type":"uint256"}]},{"type":"function","name":"proceeds","constant":true,"stateMutability":"view","payable":false,"gas":1099510627775,"inputs":[{"type":"address"}],"outputs":[{"type":"uint256"}]},{"type":"function","name":"unlistNft","constant":false,"payable":false,"gas":1099510627775,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"nftId"}],"outputs":[]},{"type":"function","name":"updateListing","constant":false,"payable":false,"gas":1099510627775,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"nftId"},{"type":"uint256","name":"price"}],"outputs":[]},{"type":"function","name":"withdrawProceeds","constant":false,"payable":false,"gas":1099510627775,"inputs":[],"outputs":[]}] as const
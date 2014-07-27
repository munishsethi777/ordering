//page
var PageList = '';
var TotalRows = 0;
var PageCount = 0;
var PageSize = 5;
var SelectedRow = 1;
var iIterate = 1;

// generate navigation buttion
function GeneratePageList(iStartIndex) {

    PageList = '';
    iIterate = 0;
    //SelectedRow = 1;

    //HideGridError();

    while (SelectedRow > ((iStartIndex - 1) + 5)) {
        iStartIndex = (iIterate * 5) + 1;
        iIterate++;

    }

    for (var i = iStartIndex; i <= ((iStartIndex - 1) + 5); i++) {
        PageCount = i * PageSize;

        if (PageCount <= TotalRows) {
            if (i == SelectedRow) {
                PageList += '<li class="disabled"><a href="#" class="active">' + i + '</a></li>';
            }
            else
                PageList += '<li><a href="#" class="page">' + i + '</a></li>';

        } //if
    } // for

    // add next button
    if (TotalRows > PageCount)
        PageList += '<li><a href="#" class="next">Next &raquo;</a></li>';


    //remove current paging- add new paging
    $(".pagination ul li").remove();
    $(".pagination ul").append(PageList);

    // add previous button
    if ((PageCount / PageSize) > 5)
        $(".pagination ul li:first").before('<li><a href="#" class="previous">&laquo; Previous</a></li>');


    //if  you click next
    $('.next').click(function () {
        SelectedRow = (PageCount / PageSize) + 1;
        LoadTank(SelectedRow);
        //GeneratePageList((PageCount / PageSize) + 1);
    });

    //if  you click previous
    $('.previous').click(function () {
        SelectedRow = ((PageCount / PageSize) - (2 * 5)) + 1;
        LoadTank(SelectedRow);
        //GeneratePageList(((PageCount / PageSize) - (2 * PageSize)) + 1);
    });

    // page navigation
    $('.page').click(function () {

        $('.pagination a[class=active]').each(function () {
            $(this).attr('class', 'page');
        });
        this.className = 'active';
        //if (this.innerText = undefined)
            SelectedRow = this.innerHTML;
//        else
//            SelectedRow = this.innerText;

        //call service - paging method
        LoadTank(SelectedRow); //this.innerText;
    });


}  // GeneratePageList
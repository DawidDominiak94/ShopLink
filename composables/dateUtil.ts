export const formatDateLong = ( date : Date | string) => {

    if( typeof date === 'string' )
        date = new Date(date);

    return new Intl.DateTimeFormat('pl-PL', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(date);
}

export const formatDateShort = ( date : Date | string) => {
    
    if( typeof date === 'string' )
        date = new Date(date);

    return new Intl.DateTimeFormat('pl-PL', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

export const formatDateInput = ( date : Date | string | undefined) => {
    
    date ??= new Date();

    if( typeof date === 'string' )
        date = new Date(date);


    // return an date in format dd-mm-yyyy hh24-mi
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const monthNumber = date.getMonth() + 1;
    const month = monthNumber < 10 ? '0' + monthNumber : monthNumber;
    useLogger('formatDateInput').debug(' date.getMonth()',  date.getMonth());

    const year = date.getFullYear();
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    useLogger('formatDateInput').debug('date', `${year}-${month}-${day} ${hours}:${minutes}`);

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

$(document).ready(function() {
    window.selectedRole = null;

    $('.form-control').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        if ($(this).val() === '') {
            $(this).parent().removeClass('focused');
        }
    });

    $('.social_icon span, .input-group-text').hover(
        function() { $(this).addClass('hovered'); },
        function() { $(this).removeClass('hovered'); }
    );

    $('.card').hide().fadeIn(1000);

    $('.login_btn').hover(
        function() { $(this).addClass('btn-hover'); },
        function() { $(this).removeClass('btn-hover'); }
    );

    $('a').hover(
        function() { $(this).addClass('link-hover'); },
        function() { $(this).removeClass('link-hover'); }
    );

    $('#roleModal').modal('show');

    $('#roleModal').on('shown.bs.modal', function () {
        $('.main-container').addClass('blur');
    });

    $('#roleModal').on('hidden.bs.modal', function () {
        $('.main-container').removeClass('blur');
    });

    $('#clientBtn, #engineerBtn').click(function() {
        if ($(this).attr('id') === 'clientBtn') {
            window.selectedRole = 'Client';
            $('.card-header h3').text('Sign In to Client Portal');
            $('.card-header').css({
                'font-family': "'Roboto Slab', serif",
                'color': '#FFC312'
            });
        } else if ($(this).attr('id') === 'engineerBtn') {
            window.selectedRole = 'Engineer';
            $('.card-header h3').text('Sign In to Engineer Portal');
            $('.card-header').css({
                'font-family': "'Roboto Slab', serif",
                'color': '#12CBC4'
            });
        }
        $(this).addClass('pulse-effect');
        setTimeout(() => { $(this).removeClass('pulse-effect'); }, 600);
        $('#roleModal').modal('hide');
    });

    $('.remember input').on('change', function() {
        if ($(this).is(':checked')) {
            const username = $('input[type="text"]').val();
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
    });
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        $('input[type="text"]').val(rememberedUsername);
        $('.remember input').prop('checked', true);
    }
});
